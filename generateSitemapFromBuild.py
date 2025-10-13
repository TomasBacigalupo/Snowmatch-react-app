#!/usr/bin/env python3
"""
Generador automático de sitemap basado en archivos HTML prerenderizados en /build
"""
import os
import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom
from datetime import datetime
from pathlib import Path

# Configuración
BUILD_DIR = "build"
BASE_URL = "https://snowmatch.pro"
TODAY = datetime.now().strftime("%Y-%m-%d")

# Configuración de prioridades y frecuencias según el tipo de página
PAGE_CONFIG = {
    # Páginas principales
    'root': {'priority': '1.0', 'changefreq': 'daily'},
    'home_lang': {'priority': '0.9', 'changefreq': 'daily'},
    
    # Páginas de contenido
    'resorts': {'priority': '0.8', 'changefreq': 'weekly'},
    'resorts_discipline': {'priority': '0.7', 'changefreq': 'weekly'},
    'resorts_full': {'priority': '0.6', 'changefreq': 'weekly'},
    
    # Páginas de profesores/perfiles
    'profiles': {'priority': '0.7', 'changefreq': 'weekly'},
    
    # Páginas de servicios
    'services': {'priority': '0.8', 'changefreq': 'weekly'},
    
    # Páginas informativas
    'info': {'priority': '0.6', 'changefreq': 'monthly'},
    
    # Páginas de autenticación
    'auth': {'priority': '0.5', 'changefreq': 'yearly'},
    
    # Default
    'default': {'priority': '0.5', 'changefreq': 'monthly'}
}

def should_include_in_sitemap(path):
    """
    Determina si una ruta debe incluirse en el sitemap
    """
    # Excluir archivos que no sean index.html en la raíz de build
    if path.name == '404.html' or path.name == '200.html':
        return False
    
    # Excluir directorios de recursos
    exclude_dirs = ['static', 'assets', 'fonts', 'icons', 'favicon', 'logo']
    for exclude in exclude_dirs:
        if f'/{exclude}/' in str(path):
            return False
    
    return True

def get_page_type(url_path):
    """
    Determina el tipo de página basado en la URL
    """
    parts = [p for p in url_path.split('/') if p]
    
    # Página raíz
    if not parts or url_path == '/':
        return 'root'
    
    # Home con idioma (es/, en/, pt/, fr/)
    if len(parts) == 1 and parts[0] in ['es', 'en', 'pt', 'fr']:
        return 'home_lang'
    
    # Páginas de autenticación
    if 'auth' in parts:
        return 'auth'
    
    # Páginas de perfil
    if 'profile' in parts:
        return 'profiles'
    
    # Servicios principales
    service_keywords = ['video-coach', 'video-onboarding', 'instructor', 'all-teachers', 'contact-us']
    if any(keyword in parts for keyword in service_keywords):
        return 'services'
    
    # Páginas informativas
    info_keywords = ['faqs', 'legal', 'noticias']
    if any(keyword in parts for keyword in info_keywords):
        return 'info'
    
    # Resorts
    resort_keywords = ['cerro-', 'aspen', 'vail', 'buttermilk', 'snowmass', 'zermatt', 
                       'grandvalira', 'canillo', 'soldeu', 'tarter', 'highlands',
                       'bariloche', 'chapelco', 'bayo', 'perito-moreno', 'castor',
                       'lago-hermoso', 'las-leñas']
    
    for part in parts:
        if any(resort in part for resort in resort_keywords):
            # Contar niveles después del resort
            resort_index = parts.index(part)
            levels_after = len(parts) - resort_index - 1
            
            if levels_after == 0:
                return 'resorts'
            elif levels_after == 1:
                return 'resorts_discipline'
            else:
                return 'resorts_full'
    
    return 'default'

def html_path_to_url(html_path, build_dir):
    """
    Convierte una ruta de archivo HTML a una URL limpia
    """
    # Obtener ruta relativa al directorio build
    rel_path = html_path.relative_to(build_dir)
    
    # Convertir a string y limpiar
    url_path = str(rel_path)
    
    # Remover index.html del final
    if url_path.endswith('index.html'):
        url_path = url_path[:-10]  # Remover 'index.html'
    elif url_path.endswith('.html'):
        url_path = url_path[:-5]  # Remover '.html'
    
    # Asegurar que empiece con /
    if not url_path.startswith('/'):
        url_path = '/' + url_path
    
    # Remover / duplicados
    while '//' in url_path:
        url_path = url_path.replace('//', '/')
    
    # Si termina en /, removerlo (excepto para root)
    if url_path != '/' and url_path.endswith('/'):
        url_path = url_path[:-1]
    
    return url_path

def generate_sitemap(build_dir=BUILD_DIR, base_url=BASE_URL):
    """
    Genera el sitemap basándose en archivos HTML en el directorio build
    """
    build_path = Path(build_dir)
    
    if not build_path.exists():
        raise FileNotFoundError(f"El directorio {build_dir} no existe")
    
    # Buscar todos los archivos HTML
    html_files = list(build_path.rglob('*.html'))
    
    # Filtrar archivos que deben incluirse
    html_files = [f for f in html_files if should_include_in_sitemap(f)]
    
    # Crear elemento raíz del sitemap
    urlset = ET.Element(
        "urlset", 
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    )
    
    # Convertir archivos HTML a URLs
    urls_data = []
    for html_file in html_files:
        url_path = html_path_to_url(html_file, build_path)
        page_type = get_page_type(url_path)
        config = PAGE_CONFIG.get(page_type, PAGE_CONFIG['default'])
        
        urls_data.append({
            'loc': f"{base_url}{url_path}",
            'priority': config['priority'],
            'changefreq': config['changefreq']
        })
    
    # Ordenar URLs alfabéticamente para consistencia
    urls_data.sort(key=lambda x: x['loc'])
    
    # Agregar URLs al sitemap
    for url_data in urls_data:
        url_elem = ET.SubElement(urlset, "url")
        ET.SubElement(url_elem, "loc").text = url_data['loc']
        ET.SubElement(url_elem, "lastmod").text = TODAY
        ET.SubElement(url_elem, "changefreq").text = url_data['changefreq']
        ET.SubElement(url_elem, "priority").text = url_data['priority']
    
    # Convertir a string XML con formato legible
    xml_str = minidom.parseString(ET.tostring(urlset)).toprettyxml(indent="  ")
    
    # Guardar en archivo
    output_file = "sitemap.xml"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(xml_str)
    
    # También copiar a la carpeta build
    build_output = os.path.join(build_dir, "sitemap.xml")
    with open(build_output, "w", encoding="utf-8") as f:
        f.write(xml_str)
    
    # Estadísticas
    print(f"✅ Sitemap generado exitosamente!")
    print(f"📁 Archivos procesados: {len(html_files)}")
    print(f"🔗 URLs en el sitemap: {len(urls_data)}")
    print(f"📝 Archivo guardado en: {output_file}")
    print(f"📝 Copia guardada en: {build_output}")
    
    # Mostrar resumen por tipo de página
    print("\n📊 Resumen por tipo de página:")
    type_counts = {}
    for url_data in urls_data:
        url_path = url_data['loc'].replace(base_url, '')
        page_type = get_page_type(url_path)
        type_counts[page_type] = type_counts.get(page_type, 0) + 1
    
    for page_type, count in sorted(type_counts.items(), key=lambda x: x[1], reverse=True):
        config = PAGE_CONFIG.get(page_type, PAGE_CONFIG['default'])
        print(f"  • {page_type}: {count} páginas (prioridad: {config['priority']}, frecuencia: {config['changefreq']})")
    
    return len(urls_data)

if __name__ == "__main__":
    try:
        generate_sitemap()
    except Exception as e:
        print(f"❌ Error generando sitemap: {e}")
        import traceback
        traceback.print_exc()

