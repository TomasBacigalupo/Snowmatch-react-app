import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom
from datetime import datetime

# Listas de entrada
resorts = [
    "bariloche",
    "lago-hermoso",
    "cerro-bayo",
    "cerro-chapelco",
    "cerro-bayo",
    "laderas", "perito-moreno",
    "laderas-perito-moreno", "bolson", "el-bolson", "las-leñas", "mendoza", "san-rafael",
    "castor", 
    "buenos-aires",
    "portillo",
]

disciplines = [
    "ski", "snow", "snowboard",
]
types = [
    "grupales", "privadas", "niños", "adultos", "amigos", "familias", "estudiantes",
    "profesionales", "principiantes", "expertos", "free-ride", "freeride", "furea-de-pista",
    "pista", "bumps", "freestyle", "slalom", "park", "saltos"
]
teacher_urls = [
    "/match/teacher/175", "/match/teacher/101", "/match/teacher/84", "/match/teacher/293",
    "/match/teacher/288", "/match/teacher/214", "/match/teacher/212", "/match/teacher/47",
    "/match/teacher/138", "/match/teacher/11", "/match/teacher/204", "/match/teacher/216",
    "/match/teacher/119", "/match/teacher/5", "/match/teacher/145", "/match/teacher/89",
    "/match/teacher/296", "/match/teacher/278", "/match/teacher/289", "/match/teacher/364",
    "/match/teacher/35", "/match/teacher/120", "/match/teacher/271", "/match/teacher/25",
    "/match/teacher/360", "/match/teacher/51", "/match/teacher/183", "/match/teacher/90",
    "/match/teacher/107", "/match/teacher/365", "/match/teacher/28", "/match/teacher/680",
    "/match/teacher/577", "/match/teacher/584", "/match/teacher/597", "/match/teacher/108",
    "/match/teacher/252", "/match/teacher/40", "/match/teacher/242", "/match/teacher/280",
    "/match/teacher/655", "/match/teacher/208", "/match/teacher/308", "/match/teacher/609",
    "/match/teacher/313", "/match/teacher/22", "/match/teacher/17", "/match/teacher/332",
    "/match/teacher/243", "/match/teacher/726", "/match/teacher/143", "/match/teacher/123",
    "/match/teacher/610", "/match/teacher/94", "/match/teacher/163", "/match/teacher/87",
    "/match/teacher/672", "/match/teacher/601", "/match/teacher/79", "/match/teacher/102",
    "/match/teacher/301", "/match/teacher/136", "/match/teacher/133", "/match/teacher/146",
    "/match/teacher/158", "/match/teacher/81", "/match/teacher/88", "/match/teacher/124",
    "/match/teacher/480", "/match/teacher/207", "/match/teacher/217", "/match/teacher/103",
    "/match/teacher/137", "/match/teacher/162", "/match/teacher/56", "/match/teacher/118",
    "/match/teacher/121", "/match/teacher/73", "/match/teacher/104", "/match/teacher/78",
    "/match/teacher/404", "/match/teacher/398", "/match/teacher/45", "/match/teacher/117",
    "/match/teacher/135", "/match/teacher/653", "/match/teacher/12", "/match/teacher/174",
    "/match/teacher/99", "/match/teacher/283", "/match/teacher/209", "/match/teacher/144",
    "/match/teacher/83", "/match/teacher/20", "/match/teacher/86", "/match/teacher/30",
    "/match/teacher/39", "/match/teacher/33", "/match/teacher/132", "/match/teacher/112",
    "/match/teacher/613", "/match/teacher/220", "/match/teacher/229", "/match/teacher/93",
    "/match/teacher/683", "/match/teacher/125", "/match/teacher/95", "/match/teacher/139",
    "/match/teacher/159", "/match/teacher/129", "/match/teacher/98", "/match/teacher/141",
    "/match/teacher/126", "/match/teacher/127", "/match/teacher/134", "/match/teacher/140",
    "/match/teacher/173", "/match/teacher/284", "/match/teacher/681", "/match/teacher/687",
    "/match/teacher/49", "/match/teacher/306", "/match/teacher/310", "/match/teacher/402",
    "/match/teacher/294", "/match/teacher/286", "/match/teacher/179", "/match/teacher/76",
    "/match/teacher/205", "/match/teacher/130", "/match/teacher/46", "/match/teacher/167",
    "/match/teacher/362", "/match/teacher/262", "/match/teacher/235", "/match/teacher/48",
    "/match/teacher/34", "/match/teacher/251", "/match/teacher/180", "/match/teacher/36",
    "/match/teacher/287", "/match/teacher/111", "/match/teacher/702", "/match/teacher/337",
    "/match/teacher/349", "/match/teacher/745", "/match/teacher/277", "/match/teacher/292",
    "/match/teacher/350", "/match/teacher/100", "/match/teacher/641", "/match/teacher/249",
    "/match/teacher/407", "/match/teacher/246", "/match/teacher/18", "/match/teacher/282",
    "/match/teacher/7", "/match/teacher/202", "/match/teacher/203", "/match/teacher/147",
    "/match/teacher/15", "/match/teacher/392", "/match/teacher/670", "/match/teacher/648",
    "/match/teacher/297", "/match/teacher/422", "/match/teacher/408", "/match/teacher/382",
    "/match/teacher/85", "/match/teacher/405", "/match/teacher/420", "/match/teacher/428",
    "/match/teacher/128", "/match/teacher/626", "/match/teacher/13", "/match/teacher/721",
    "/match/teacher/383", "/match/teacher/367", "/match/teacher/247", "/match/teacher/409",
    "/match/teacher/400", "/match/teacher/585", "/match/teacher/200", "/match/teacher/26",
    "/match/teacher/74", "/match/teacher/536", "/match/teacher/583", "/match/teacher/106",
    "/match/teacher/248", "/match/teacher/245", "/match/teacher/414", "/match/teacher/435",
    "/match/teacher/451", "/match/teacher/704", "/match/teacher/452", "/match/teacher/459",
    "/match/teacher/461", "/match/teacher/96", "/match/teacher/678", "/match/teacher/679",
    "/match/teacher/347", "/match/teacher/116", "/match/teacher/473", "/match/teacher/504",
    "/match/teacher/623", "/match/teacher/110", "/match/teacher/506", "/match/teacher/686",
    "/match/teacher/113", "/match/teacher/122", "/match/teacher/633", "/match/teacher/290",
    "/match/teacher/624", "/match/teacher/647", "/match/teacher/91", "/match/teacher/605",
    "/match/teacher/19", "/match/teacher/21", "/match/teacher/631", "/match/teacher/637",
    "/match/teacher/592", "/match/teacher/634", "/match/teacher/281", "/match/teacher/23",
    "/match/teacher/29", "/match/teacher/690", "/match/teacher/24", "/match/teacher/603",
    "/match/teacher/625", "/match/teacher/596", "/match/teacher/131", "/match/teacher/607",
    "/match/teacher/615", "/match/teacher/582", "/match/teacher/109", "/match/teacher/425",
    "/match/teacher/185", "/match/teacher/234", "/match/teacher/311", "/match/teacher/616",
    "/match/teacher/595", "/match/teacher/604", "/match/teacher/635", "/match/teacher/43",
    "/match/teacher/304", "/match/teacher/44", "/match/teacher/608", "/match/teacher/184",
    "/match/teacher/97", "/match/teacher/768", "/match/teacher/905", "/match/teacher/684",
    "/match/teacher/682", "/match/teacher/685", "/match/teacher/688", "/match/teacher/201",
    "/match/teacher/619", "/match/teacher/645", "/match/teacher/105", "/match/teacher/75",
    "/match/teacher/206", "/match/teacher/9", "/match/teacher/563", "/match/teacher/910",
    "/match/teacher/728", "/match/teacher/142", "/match/teacher/750", "/match/teacher/752",
    "/match/teacher/92", "/match/teacher/41", "/match/teacher/761", "/match/teacher/899",
    "/match/teacher/363", "/match/teacher/32", "/match/teacher/773", "/match/teacher/890",
    "/match/teacher/904", "/match/teacher/912", "/match/teacher/763", "/match/teacher/782",
    "/match/teacher/80", "/match/teacher/38", "/match/teacher/77", "/match/teacher/828",
    "/match/teacher/295", "/match/teacher/844", "/match/teacher/847", "/match/teacher/848",
    "/match/teacher/850", "/match/teacher/846", "/match/teacher/849", "/match/teacher/840",
    "/match/teacher/901", "/match/teacher/8", "/match/teacher/50", "/match/teacher/27",
    "/match/teacher/909", "/match/teacher/16", "/match/teacher/902", "/match/teacher/897",
    "/match/teacher/326", "/match/teacher/14", "/match/teacher/397", "/match/teacher/903",
    "/match/teacher/879"
]

blog_urls = [
    "/noticias",
    "/noticias/3-maneras-de-mejorar-tu-esqui-por-tu-cuenta",
    "/noticias/temporada-de-invierno-2025-fechas-de-apertura-y-novedades-en-los-centros-de-esqui-argentinos",
    "/noticias/el-cerro-chapelco-ahora-en-manos-del-grupo-trappa",
    "/noticias//confirmado-el-precio-del-pase-de-esqui-para-esta-temporada-en-cerro-catedral",
    "/noticias/cuanto-cuesta-una-clase-de-esqui-en-cerro-catedral-precios-2025",
    "/noticias/como-sacar-clases-de-ski-en-bariloche-paso-a-paso-facil-y-rapido",
    "/noticias/casco-de-esqui-tipos-tamanos-y-consejos-para-elegirlo",
    "/noticias/todo-lo-que-necesitas-saber-antes-de-tu-clase-de-esqui-con-snowmatch-2",
    "/noticias/que-es-la-posicion-dinamica-de-equilibrio-y-por-que-deberias-incorporarla-al-esquiar",
    "/escuela-de-esqui-y-snowboard",
    "/escola-de-esqui-e-snowboard",
    "/heliski"
]

# Configuración del sitemap
base_url = "https://snowmatch.pro"  # Reemplaza con tu dominio real
today = datetime.now().strftime("%Y-%m-%d")

# Crear el elemento raíz del sitemap
urlset = ET.Element(
    "urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

# Generar URLs para /resorts
for resort in resorts:
    url = ET.SubElement(urlset, "url")
    ET.SubElement(url, "loc").text = f"{base_url}/{resort}"
    ET.SubElement(url, "lastmod").text = today
    ET.SubElement(url, "changefreq").text = "weekly"
    ET.SubElement(url, "priority").text = "0.8"

# Generar URLs en portugués para /pt/resorts
for resort in resorts:
    url = ET.SubElement(urlset, "url")
    ET.SubElement(url, "loc").text = f"{base_url}/pt/{resort}"
    ET.SubElement(url, "lastmod").text = today
    ET.SubElement(url, "changefreq").text = "weekly"
    ET.SubElement(url, "priority").text = "0.8"

# Generar URLs para /resorts/disciplines
for resort in resorts:
    for discipline in disciplines:
        url = ET.SubElement(urlset, "url")
        ET.SubElement(url, "loc").text = f"{base_url}/{resort}/{discipline}"
        ET.SubElement(url, "lastmod").text = today
        ET.SubElement(url, "changefreq").text = "weekly"
        ET.SubElement(url, "priority").text = "0.7"

# Generar URLs en portugués para /pt/resorts/disciplines
for resort in resorts:
    for discipline in disciplines:
        url = ET.SubElement(urlset, "url")
        ET.SubElement(url, "loc").text = f"{base_url}/pt/{resort}/{discipline}"
        ET.SubElement(url, "lastmod").text = today
        ET.SubElement(url, "changefreq").text = "weekly"
        ET.SubElement(url, "priority").text = "0.7"

# Generar URLs para /resorts/disciplines/types
for resort in resorts:
    for discipline in disciplines:
        for type_ in types:
            url = ET.SubElement(urlset, "url")
            ET.SubElement(
                url, "loc").text = f"{base_url}/{resort}/{discipline}/{type_}"
            ET.SubElement(url, "lastmod").text = today
            ET.SubElement(url, "changefreq").text = "weekly"
            ET.SubElement(url, "priority").text = "0.6"

# Generar URLs en portugués para /pt/resorts/disciplines/types
for resort in resorts:
    for discipline in disciplines:
        for type_ in types:
            url = ET.SubElement(urlset, "url")
            ET.SubElement(
                url, "loc").text = f"{base_url}/pt/{resort}/{discipline}/{type_}"
            ET.SubElement(url, "lastmod").text = today
            ET.SubElement(url, "changefreq").text = "weekly"
            ET.SubElement(url, "priority").text = "0.6"

# Generar URLs para /match/teacher/{id}
for teacher_url in teacher_urls:
    url = ET.SubElement(urlset, "url")
    ET.SubElement(url, "loc").text = f"{base_url}{teacher_url}"
    ET.SubElement(url, "lastmod").text = today
    ET.SubElement(url, "changefreq").text = "weekly"
    ET.SubElement(url, "priority").text = "0.5"

# Generar URLs en portugués para /pt/match/teacher/{id}
for teacher_url in teacher_urls:
    url = ET.SubElement(urlset, "url")
    ET.SubElement(url, "loc").text = f"{base_url}/pt{teacher_url}"
    ET.SubElement(url, "lastmod").text = today
    ET.SubElement(url, "changefreq").text = "weekly"
    ET.SubElement(url, "priority").text = "0.5"


# Generar URLs para blog
for blog_url in blog_urls:
    url = ET.SubElement(urlset, "url")
    ET.SubElement(url, "loc").text = f"{base_url}{blog_url}"
    ET.SubElement(url, "lastmod").text = today
    ET.SubElement(url, "changefreq").text = "weekly"
    ET.SubElement(url, "priority").text = "0.7"

# Generar URLs en portugués para blog
for blog_url in blog_urls:
    url = ET.SubElement(urlset, "url")
    ET.SubElement(url, "loc").text = f"{base_url}/pt{blog_url}"
    ET.SubElement(url, "lastmod").text = today
    ET.SubElement(url, "changefreq").text = "weekly"
    ET.SubElement(url, "priority").text = "0.7"

# Generar URLs en ingles para blog
for blog_url in blog_urls:
    url = ET.SubElement(urlset, "url")
    ET.SubElement(url, "loc").text = f"{base_url}/en{blog_url}"
    ET.SubElement(url, "lastmod").text = today
    ET.SubElement(url, "changefreq").text = "weekly"
    ET.SubElement(url, "priority").text = "0.7"

# Convertir a string XML con formato legible
xml_str = minidom.parseString(ET.tostring(urlset)).toprettyxml(indent="  ")

# Guardar en un archivo
with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write(xml_str)

print("Sitemap generado con éxito en 'sitemap.xml'.")
