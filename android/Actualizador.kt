package PAQUETE

// Copia compartida: el original está en C:\Juegos\Pagina Forja\android\Actualizador.kt.
// Se copia a cada app cambiando solo la línea "package".

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.provider.Settings
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.heightIn
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.FileProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.util.Locale

/**
 * Mira en GitHub Releases (repositorio de la web Forja) si hay una versión más nueva de esta app,
 * la descarga y abre el instalador de Android. No envía ningún dato: solo lee la lista pública.
 */
class Actualizador(private val ctx: Context, private val app: String, val nombreApp: String) {
    data class Nueva(val version: String, val notas: String, val url: String, val bytes: Long)

    var nueva by mutableStateOf<Nueva?>(null)
    var visible by mutableStateOf(false)
    var progreso by mutableStateOf<Float?>(null)
    var listo by mutableStateOf<File?>(null)
    var estado by mutableStateOf<String?>(null)

    val versionActual: String = runCatching {
        ctx.packageManager.getPackageInfo(ctx.packageName, 0).versionName
    }.getOrNull() ?: "0"

    suspend fun comprobar() {
        val n = withContext(Dispatchers.IO) { runCatching { buscar() }.getOrNull() } ?: return
        nueva = n
        visible = true
    }

    private fun buscar(): Nueva? {
        val c = URL(API).openConnection() as HttpURLConnection
        c.connectTimeout = 8000
        c.readTimeout = 8000
        c.setRequestProperty("Accept", "application/vnd.github+json")
        val lista = c.inputStream.bufferedReader().use { JSONArray(it.readText()) }
        var mejor: Nueva? = null
        for (i in 0 until lista.length()) {
            val r = lista.getJSONObject(i)
            if (r.optBoolean("draft") || r.optBoolean("prerelease")) continue
            val tag = r.optString("tag_name")
            if (!tag.startsWith("$app-v")) continue
            val v = tag.removePrefix("$app-v")
            if (!esMayor(v, versionActual) || (mejor != null && !esMayor(v, mejor.version))) continue
            val assets = r.optJSONArray("assets") ?: continue
            for (j in 0 until assets.length()) {
                val a = assets.getJSONObject(j)
                if (a.optString("name").endsWith(".apk")) {
                    mejor = Nueva(v, r.optString("body").trim(), a.optString("browser_download_url"), a.optLong("size"))
                    break
                }
            }
        }
        return mejor
    }

    suspend fun descargar() {
        val n = nueva ?: return
        estado = null
        progreso = 0f
        val ok = withContext(Dispatchers.IO) {
            runCatching {
                val dir = File(ctx.cacheDir, "actualizacion").apply { mkdirs() }
                dir.listFiles()?.forEach { it.delete() }
                val destino = File(dir, "$app-${n.version}.apk")
                var c = URL(n.url).openConnection() as HttpURLConnection
                c.instanceFollowRedirects = true
                c.connectTimeout = 15000
                c.readTimeout = 30000
                // GitHub redirige a otro dominio: seguimos la redirección a mano por si acaso
                if (c.responseCode in 300..399) {
                    val sig = c.getHeaderField("Location")
                    c.disconnect()
                    c = URL(sig).openConnection() as HttpURLConnection
                }
                val total = c.contentLengthLong.takeIf { it > 0 } ?: n.bytes
                c.inputStream.use { ent ->
                    destino.outputStream().use { sal ->
                        val buf = ByteArray(64 * 1024)
                        var leido = 0L
                        while (true) {
                            val k = ent.read(buf)
                            if (k < 0) break
                            sal.write(buf, 0, k)
                            leido += k
                            if (total > 0) progreso = (leido.toFloat() / total).coerceIn(0f, 1f)
                        }
                    }
                }
                destino
            }.getOrNull()
        }
        progreso = null
        if (ok == null) {
            estado = "No se pudo descargar. Revisa la conexión e inténtalo otra vez."
            return
        }
        listo = ok
        instalar()
    }

    fun instalar() {
        val f = listo ?: return
        if (!ctx.packageManager.canRequestPackageInstalls()) {
            estado = "Android necesita tu permiso: activa «Permitir de esta fuente», vuelve y toca Instalar."
            ctx.startActivity(
                Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:${ctx.packageName}"))
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            )
            return
        }
        estado = null
        val uri = FileProvider.getUriForFile(ctx, "${ctx.packageName}.archivos", f)
        ctx.startActivity(
            Intent(Intent.ACTION_VIEW).setDataAndType(uri, "application/vnd.android.package-archive")
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK)
        )
    }

    companion object {
        const val API = "https://api.github.com/repos/lapanamericana64-byte/forja/releases?per_page=50"

        fun esMayor(a: String, b: String): Boolean {
            val x = a.split('.').map { it.filter(Char::isDigit).toIntOrNull() ?: 0 }
            val y = b.split('.').map { it.filter(Char::isDigit).toIntOrNull() ?: 0 }
            for (i in 0 until maxOf(x.size, y.size)) {
                val d = x.getOrElse(i) { 0 } - y.getOrElse(i) { 0 }
                if (d != 0) return d > 0
            }
            return false
        }

        fun peso(bytes: Long): String {
            val mb = bytes / 1024.0 / 1024.0
            return String.format(Locale("es"), if (mb < 10) "%.1f MB" else "%.0f MB", mb)
        }
    }
}

/** Aviso "Hay una versión nueva" con barra de progreso mientras descarga. */
@Composable
fun DialogoActualizacion(a: Actualizador, acento: Color, tarjeta: Color, texto: Color, tenue: Color) {
    val n = a.nueva ?: return
    if (!a.visible) return
    val alcance = rememberCoroutineScope()
    val descargando = a.progreso != null
    AlertDialog(
        onDismissRequest = { if (!descargando) a.visible = false },
        containerColor = tarjeta,
        title = { Text("Hay una versión nueva", color = texto, fontWeight = FontWeight.Bold) },
        text = {
            Column {
                Text("${a.nombreApp} ${n.version}  (tienes la ${a.versionActual})", color = texto, fontWeight = FontWeight.SemiBold)
                if (n.bytes > 0) Text("Descarga de ${Actualizador.peso(n.bytes)}", color = tenue, fontSize = 13.sp)
                if (n.notas.isNotBlank()) {
                    Spacer(Modifier.height(12.dp))
                    Text("Novedades", color = tenue, fontSize = 13.sp)
                    Text(n.notas, color = texto, fontSize = 14.sp,
                        modifier = Modifier.heightIn(max = 220.dp).verticalScroll(rememberScrollState()))
                }
                a.progreso?.let {
                    Spacer(Modifier.height(16.dp))
                    LinearProgressIndicator(progress = { it }, color = acento, trackColor = tenue.copy(alpha = 0.25f),
                        modifier = Modifier.fillMaxWidth())
                    Text("Descargando… ${(it * 100).toInt()} %", color = tenue, fontSize = 13.sp)
                }
                a.estado?.let {
                    Spacer(Modifier.height(12.dp))
                    Text(it, color = acento, fontSize = 13.sp)
                }
            }
        },
        confirmButton = {
            if (!descargando) TextButton({
                if (a.listo != null) a.instalar() else alcance.launch { a.descargar() }
            }) { Text(if (a.listo != null) "Instalar" else "Actualizar", color = acento, fontWeight = FontWeight.Bold) }
        },
        dismissButton = {
            if (!descargando) TextButton({ a.visible = false }) { Text("Más tarde", color = texto) }
        },
    )
}
