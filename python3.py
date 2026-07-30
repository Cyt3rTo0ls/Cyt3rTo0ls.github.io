#!/usr/bin/env python3
"""
Cyt3rTools - Telegram Mass Broadcaster
Envía mensaje a grupos públicos de compra/venta, cripto, infidelidad y afines
"""

import os
import sys
import subprocess
import asyncio
import random
import time

# ============================================================
# CONFIGURACIÓN - CAMBIA SOLO ESTO
# ============================================================
API_ID = 36560114
API_HASH = "db08bd900d7997c26d68cac042f43c1a"
PHONE = "+584120564008"  # Tu número completo con código de país

MENSAJE = """CYT3rTools | Servicios Técnicos y Privacidad Digital

Soluciones técnicas especializadas, análisis de seguridad perimetral, desarrollo web y herramientas a medida orientadas a particulares bajo estrictos estándares de confidencialidad.

🛡️ Servicios Disponibles:

• Auditoría de Huella Digital (OSINT): Mapeo de información pública expuesta y registros en internet.
• Chequeo de Credenciales: Verificación en bases de datos de brechas y filtraciones masivas.
• Análisis Forense en Sandbox: Evaluación de archivos o ejecutables dudosos en entorno aislado.
• Simulación de Phishing: Pruebas de ingeniería social controladas bajo autorización previa.
• Auditoría Web Personal: Revisión de seguridad, cabeceras y configuraciones en sitios propios.
• Endurecimiento y Privacidad: Configuración guiada de 2FA, gestores de claves y blindaje de navegadores.
• Limpieza de Metadatos: Extracción de datos ocultos (coordenadas GPS, dispositivos) en archivos e imágenes.
• Scripts de Monitoreo (Python/Bash): Herramientas para vigilancia de carpetas y alertas en tiempo real.
• Bots de Telegram: Automatización de notificaciones y control remoto seguro.
• Escaneo Web Ligero: Validación de certificados SSL y puertos en dominios personales.
• Criptografía Local: Utilidades a medida para cifrado y destrucción segura de datos en disco.
• Venta de Números Virtuales: Líneas temporales para verificación de cuentas y alta privacidad.
• Desarrollo Web: Creación de sitios web modernos, portafolios y landing pages.
• PoCs y Scripts Académicos: Desarrollo de pruebas de concepto con fines educativos y de análisis defensivo.

🌐 Portal oficial: https://Cyt3rTo0ls.github.io
📧 Contacto directo: Cyt3rTo0ls@proton.me

Operaciones ejecutadas bajo márgenes de legalidad. Atención asíncrona por correo."""

# ============================================================
# KEYWORDS PARA BUSCAR GRUPOS
# ============================================================
KEYWORDS = [
    # Compra/Venta
    "compra y venta", "marketplace", "ventas online", "tienda virtual",
    "ofertas", "descuentos", "liquidacion", "remate", "barato",
    "compras", "ventas", "negocios", "emprendedores", "comercio",
    "shop", "store", "deal", "biz", "catalog",
    
    # Cripto/Finanzas
    "criptomonedas", "bitcoin", "ethereum", "trading", "inversion",
    "forex", "binance", "crypto", "btc", "eth", "usdt",
    "ganancias", "dinero", "finanzas", "inversores", "wallet",
    "mineria", "nft", "token", "blockchain", "defi",
    
    # Infidelidad/Relaciones
    "infieles", "infidelidad", "amantes", "parejas", "divorcios",
    "relaciones", "amor", "citas", "solteros", "ligar",
    "busco pareja", "dating", "match", "encuentros",
    
    # Tecnología
    "tecnologia", "celulares", "iphone", "android", "computadoras",
    "laptop", "gamer", "pc", "software", "apps",
    "programacion", "diseño web", "freelance", "trabajo remoto",
    
    # Varios
    "anuncios", "clasificados", "publicidad", "promociones",
    "servicios", "soluciones", "ayuda", "consultoria",
    "grupo", "comunidad", "chat", "canal",
    
    # Países hispanos
    "venezuela", "colombia", "mexico", "argentina", "chile",
    "peru", "ecuador", "españa", "latino", "hispano",
    "caracas", "bogota", "lima", "buenos aires", "santiago",
    "madrid", "barcelona", "miami", "panama",
]

# ============================================================
# CONFIGURACIÓN DE ENVÍO
# ============================================================
MAX_GRUPOS_POR_KEYWORD = 15
DELAY_ENTRE_MENSAJES_MIN = 10
DELAY_ENTRE_MENSAJES_MAX = 20
DELAY_ENTRE_KEYWORDS = 8
MAX_TOTAL_ENVIOS = 200

# ============================================================
# NO TOCAR DE AQUÍ PARA ABAJO
# ============================================================

def setup_environment():
    """Crea entorno virtual e instala dependencias"""
    print("\n" + "=" * 55)
    print("  Cyt3rTools - Configurando entorno...")
    print("=" * 55 + "\n")
    
    venv_path = os.path.join(os.getcwd(), ".venv_cyt3r")
    
    if not os.path.exists(venv_path):
        print("[*] Creando entorno virtual...")
        subprocess.run([sys.executable, "-m", "venv", ".venv_cyt3r"], check=True)
        print("[+] Entorno virtual creado")
    
    pip_path = os.path.join(venv_path, "bin", "pip")
    python_path = os.path.join(venv_path, "bin", "python")
    
    print("[*] Instalando dependencias...")
    subprocess.run([pip_path, "install", "telethon", "cryptg"], 
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print("[+] Dependencias instaladas")
    
    return python_path, venv_path


def main_script():
    """Script principal que se ejecuta dentro del venv"""
    from telethon import TelegramClient
    from telethon.errors import FloodWaitError, ChatWriteForbiddenError
    from telethon.tl.functions.messages import SearchGlobalRequest
    from telethon.tl.types import InputMessagesFilterEmpty
    
    class Broadcaster:
        def __init__(self):
            self.client = None
            self.enviados = set()
            self.total = 0
            self.exitos = 0
            self.fallos = 0
            self.flood_count = 0
        
        async def conectar(self):
            self.client = TelegramClient(".session_cyt3r", API_ID, API_HASH)
            await self.client.start(phone=PHONE)
            me = await self.client.get_me()
            print(f"[+] Conectado como: {me.first_name}\n")
        
        async def buscar_y_enviar(self, keyword, limite):
            try:
                resultados = await self.client(SearchGlobalRequest(
                    q=keyword,
                    filter=InputMessagesFilterEmpty(),
                    min_date=None,
                    max_date=None,
                    offset_rate=0,
                    offset_peer=0,
                    offset_id=0,
                    limit=limite
                ))
                
                count = 0
                for chat in resultados.chats:
                    chat_id = chat.id
                    
                    if chat_id in self.enviados:
                        continue
                    
                    self.enviados.add(chat_id)
                    self.total += 1
                    
                    nombre = getattr(chat, 'title', str(chat_id))[:40]
                    
                    try:
                        await self.client.send_message(chat, MENSAJE)
                        self.exitos += 1
                        print(f"  [{self.total}] OK | {nombre}")
                        count += 1
                    except FloodWaitError as e:
                        self.flood_count += 1
                        print(f"  [!] Flood {e.seconds}s - esperando...")
                        await asyncio.sleep(e.seconds)
                    except ChatWriteForbiddenError:
                        self.fallos += 1
                    except Exception:
                        self.fallos += 1
                    
                    delay = random.uniform(DELAY_ENTRE_MENSAJES_MIN, DELAY_ENTRE_MENSAJES_MAX)
                    await asyncio.sleep(delay)
                    
                    if self.total >= MAX_TOTAL_ENVIOS:
                        return count
                
                return count
                
            except Exception:
                return 0
        
        async def ejecutar(self):
            await self.conectar()
            
            print(f"[+] Palabras clave: {len(KEYWORDS)}")
            print(f"[+] Máximo total: {MAX_TOTAL_ENVIOS} envíos\n")
            print("-" * 50)
            
            for kw in KEYWORDS:
                if self.total >= MAX_TOTAL_ENVIOS:
                    break
                
                print(f"\n[*] Buscando: \"{kw}\"...")
                enviados = await self.buscar_y_enviar(kw, MAX_GRUPOS_POR_KEYWORD)
                print(f"    -> {enviados} mensajes enviados")
                
                await asyncio.sleep(DELAY_ENTRE_KEYWORDS)
            
            print("\n" + "=" * 50)
            print(f"  FINALIZADO")
            print(f"  Total intentos: {self.total}")
            print(f"  Exitos: {self.exitos}")
            print(f"  Fallos: {self.fallos}")
            print(f"  Floods: {self.flood_count}")
            print("=" * 50)
            
            await self.client.disconnect()
    
    async def main():
        b = Broadcaster()
        await b.ejecutar()
    
    asyncio.run(main())


if __name__ == "__main__":
    print("\n" + "=" * 55)
    print("  Cyt3rTools - Telegram Broadcaster v2.0")
    print("=" * 55)
    print(f"  API ID: {API_ID}")
    print(f"  Keywords: {len(KEYWORDS)}")
    print(f"  Max envíos: {MAX_TOTAL_ENVIOS}")
    print("=" * 55)
    
    print("\n[!] ADVERTENCIA: Violas los Términos de Servicio de Telegram")
    print("[!] Tu cuenta puede ser BANEADA permanentemente")
    print("[!] Usa bajo tu propio riesgo\n")
    
    resp = input("¿Continuar? (SI/NO): ").strip()
    if resp.upper() != "SI":
        print("[*] Cancelado")
        sys.exit(0)
    
    # Setup automático
    python_path, venv_path = setup_environment()
    
    # Ejecutar el script dentro del venv
    script_code = '''
API_ID = {api_id}
API_HASH = "{api_hash}"
PHONE = "{phone}"
MENSAJE = """{mensaje}"""
KEYWORDS = {keywords}
MAX_GRUPOS_POR_KEYWORD = {max_grupos}
DELAY_ENTRE_MENSAJES_MIN = {delay_min}
DELAY_ENTRE_MENSAJES_MAX = {delay_max}
DELAY_ENTRE_KEYWORDS = {delay_kw}
MAX_TOTAL_ENVIOS = {max_total}

{main_code}
'''
    
    # Leer el código de main_script
    import inspect
    code = inspect.getsource(main_script)
    # Quitar la definición de la función
    code = code[code.index("def main_script():"):]
    code = code[code.index("\n")+1:]
    
    script_code = script_code.format(
        api_id=API_ID,
        api_hash=API_HASH,
        phone=PHONE,
        mensaje=MENSAJE,
        keywords=KEYWORDS,
        max_grupos=MAX_GRUPOS_POR_KEYWORD,
        delay_min=DELAY_ENTRE_MENSAJES_MIN,
        delay_max=DELAY_ENTRE_MENSAJES_MAX,
        delay_kw=DELAY_ENTRE_KEYWORDS,
        max_total=MAX_TOTAL_ENVIOS,
        main_code=code
    )
    
    tmp_script = os.path.join(os.getcwd(), ".tmp_broadcaster.py")
    with open(tmp_script, 'w') as f:
        f.write(script_code)
    
    print("\n[*] Ejecutando broadcaster...\n")
    subprocess.run([python_path, tmp_script])
    
    # Limpiar
    os.remove(tmp_script)
    print("\n[*] Script finalizado")
