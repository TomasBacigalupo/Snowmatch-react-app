import psycopg2
import boto3
import os
from dotenv import load_dotenv

# --- CARGAR VARIABLES DE ENTORNO ---
load_dotenv()

# --- CONFIGURACIÓN ---
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "5432")),
    "dbname": os.getenv("DB_NAME", "postgres"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "")
}

AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

# --- CONEXIÓN BASE DE DATOS ---
def get_users_with_arn():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("SELECT userid, name, snsarnendpoint FROM users WHERE snsarnendpoint IS NOT NULL")
    users = cur.fetchall()
    cur.close()
    conn.close()
    return users

# --- ENVÍO DE NOTIFICACIÓN ---
def send_push_notification(arn, message):
    sns = boto3.client("sns", region_name=AWS_REGION)
    response = sns.publish(
        TargetArn=arn,
        Message=message
    )
    return response

# --- SCRIPT PRINCIPAL ---
def main():
    print("⏳ Buscando usuarios con ARN...")
    users = get_users_with_arn()
    
    if not users:
        print("⚠️ No se encontraron usuarios con arn_endpoint.")
        return

    print(f"✅ Se encontraron {len(users)} usuarios con arn_endpoint:")
    for user in users:
        print(f" - {user[1]} (ID: {user[0]})")

    message = input("\n📝 Escribí el contenido de la notificación push: ").strip()
    confirm = input("\n¿Querés enviar la notificación ahora? (s/n): ").strip().lower()

    if confirm != "s":
        print("❌ Cancelado por el usuario.")
        return

    print("\n🚀 Enviando notificaciones...")
    for user in users:
        name, arn = user[1], user[2]
        try:
            send_push_notification(arn, message)
            print(f"✅ Enviada a {name}")
        except Exception as e:
            print(f"❌ Error al enviar a {name}: {e}")

    print("\n🎉 ¡Notificaciones enviadas!")

if __name__ == "__main__":
    main()