"""Publica una versión nueva de una app de Forja.

Uso (desde la carpeta de la web):
    python publicar.py pulso 1.1 "C:\\Juegos\\Reproductor Android\\APK\\Pulso.apk" "Arreglado el temporizador" "Nueva pestaña de géneros"

Hace tres cosas:
  1. sube el APK a GitHub como Release (etiqueta <app>-v<versión>),
  2. actualiza en apps.js el enlace, el tamaño, la versión y las novedades de esa app,
  3. rehace versiones.json (de ahí leen las apps si hay versión nueva),
  4. guarda y sube el cambio, así la web se actualiza sola en uno o dos minutos.

Solo rehacer versiones.json:  python publicar.py --versiones
"""
import json
import os
import re
import subprocess
import sys

GH = r"C:\Program Files\GitHub CLI\gh.exe"
REPO = "lapanamericana64-byte/forja"
AQUI = os.path.dirname(os.path.abspath(__file__))


def correr(*cmd):
    print(">", " ".join(cmd))
    subprocess.run(cmd, cwd=AQUI, check=True)


def js(s):
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def versiones():
    """Rehace versiones.json con la última versión publicada de cada app (lo leen las apps para avisar)."""
    salida = subprocess.run([GH, "api", f"repos/{REPO}/releases?per_page=100"], cwd=AQUI, check=True,
                            capture_output=True, text=True, encoding="utf-8").stdout
    datos = {}
    for r in json.loads(salida):
        if r.get("draft") or r.get("prerelease") or "-v" not in r["tag_name"]:
            continue
        app, version = r["tag_name"].rsplit("-v", 1)
        apk = next((a for a in r.get("assets", []) if a["name"].endswith(".apk")), None)
        if not apk:
            continue
        if app in datos and tupla(datos[app]["version"]) >= tupla(version):
            continue
        datos[app] = {"version": version, "url": apk["browser_download_url"], "bytes": apk["size"],
                      "notas": (r.get("body") or "").strip()}
    with open(os.path.join(AQUI, "versiones.json"), "w", encoding="utf-8") as f:
        json.dump(dict(sorted(datos.items())), f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("versiones.json:", ", ".join(f"{a} {d['version']}" for a, d in sorted(datos.items())))


def tupla(v):
    return tuple(int("".join(c for c in p if c.isdigit()) or 0) for p in v.split("."))


def main():
    if len(sys.argv) == 2 and sys.argv[1] == "--versiones":
        versiones()
        return
    if len(sys.argv) < 5:
        print(__doc__)
        sys.exit(1)
    app, version, apk, *novedades = sys.argv[1:]
    if not os.path.isfile(apk):
        sys.exit(f"No encuentro el APK: {apk}")

    ruta = os.path.join(AQUI, "apps.js")
    texto = open(ruta, encoding="utf-8").read()
    m = re.search(r'\n  \{\n    id: "%s",.*?\n  \},' % re.escape(app), texto, re.S)
    if not m:
        sys.exit(f'No hay ninguna app con id "{app}" en apps.js')

    etiqueta = f"{app}-v{version}"
    nombre = os.path.basename(apk)
    mb = os.path.getsize(apk) / 1024 / 1024
    peso = (f"{mb:.1f}" if mb < 10 else f"{mb:.0f}").replace(".", ",") + " MB"
    enlace = f"https://github.com/{REPO}/releases/download/{etiqueta}/{nombre}"

    bloque = m.group(0)
    bloque = re.sub(r'descarga: ".*?"', f"descarga: {js(enlace)}", bloque)
    bloque = re.sub(r'peso: ".*?"', f"peso: {js(peso)}", bloque)
    bloque = re.sub(r'version: ".*?"', f"version: {js(version)}", bloque)
    bloque = re.sub(r"novedades: \[.*?\]", "novedades: [" + ", ".join(js(n) for n in novedades) + "]", bloque, flags=re.S)

    notas = "\n".join(f"- {n}" for n in novedades)
    correr(GH, "release", "create", etiqueta, apk, "--repo", REPO, "--title", f"{app.capitalize()} {version}", "--notes", notas)

    with open(ruta, "w", encoding="utf-8") as f:
        f.write(texto[: m.start()] + bloque + texto[m.end():])
    versiones()
    correr("git", "add", "apps.js", "versiones.json")
    correr("git", "commit", "-m", f"{app} {version}")
    correr("git", "push")
    print(f"\nListo. {app} {version} ({peso}) ya está en la web: https://{REPO.split('/')[0]}.github.io/forja/")


if __name__ == "__main__":
    main()
