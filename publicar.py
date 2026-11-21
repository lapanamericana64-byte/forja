"""Publica una versión nueva de una app de Forja.

Uso (desde la carpeta de la web):
    python publicar.py pulso 1.1 "C:\\Juegos\\Reproductor Android\\APK\\Pulso.apk" "Arreglado el temporizador" "Nueva pestaña de géneros"

Hace tres cosas:
  1. sube el APK a GitHub como Release (etiqueta <app>-v<versión>),
  2. actualiza en apps.js el enlace, el tamaño, la versión y las novedades de esa app,
  3. guarda y sube el cambio, así la web se actualiza sola en uno o dos minutos.
"""
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


def main():
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
    correr("git", "add", "apps.js")
    correr("git", "commit", "-m", f"{app} {version}")
    correr("git", "push")
    print(f"\nListo. {app} {version} ({peso}) ya está en la web: https://{REPO.split('/')[0]}.github.io/forja/")


if __name__ == "__main__":
    main()
