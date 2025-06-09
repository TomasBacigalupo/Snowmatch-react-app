import os
import requests
import subprocess

def descargar_video_s3(s3_url: str, output_path: str) -> str:
    response = requests.get(s3_url, stream=True)
    if response.status_code != 200:
        raise Exception(f"Error al descargar el archivo: {response.status_code}")

    with open(output_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    
    print(f"✅ Video descargado: {output_path}")
    return output_path

def optimizar_video(input_path: str, output_path: str):
    comando = [
        "ffmpeg",
        "-i", input_path,
        "-vf", "scale=1280:-2",         # Escala a 1280px de ancho manteniendo la proporción
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "28",                   # Más alto = más compresión
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",     # Optimiza para streaming progresivo en web
        output_path
    ]

    subprocess.run(comando, check=True)
    print(f"✅ Video optimizado: {output_path}")

def procesar_video_para_web(s3_url: str, nombre_base: str = "video"):
    temp_video = f"{nombre_base}_original.mp4"
    video_final = f"{nombre_base}_web.mp4"

    descargar_video_s3(s3_url, temp_video)
    optimizar_video(temp_video, video_final)

    # Limpieza
    os.remove(temp_video)
    print(f"🧹 Archivo temporal eliminado.")
    print(f"🎉 Video listo para web: {video_final}")

# Ejemplo de uso
if __name__ == "__main__":
    s3_link = "https://snowmatchvideos.s3.us-east-1.amazonaws.com/tips/vcortadas.mov"
    procesar_video_para_web(s3_link, "landing_video")