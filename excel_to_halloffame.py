import pandas as pd
import json
import sys
from pathlib import Path

def excel_to_halloffame_js(excel_path, output_path='hallOfFameData.js'):
    """
    Convierte un archivo Excel con información de personajes a formato hallOfFameData.js
    
    Columnas esperadas en el Excel:
    - nombre
    - nombre_artistico
    - categoria
    - fecha_fallecimiento
    - imagen
    - lugar_vivo
    - nacionalidad
    - descripcion_corta
    - frase_celebre
    - imagen_representativa
    - imagen_secundaria (NUEVA)
    """
    
    # Leer Excel
    df = pd.read_excel(excel_path)
    
    # Convertir DataFrame a lista de personajes
    persons = []
    
    for idx, row in df.iterrows():
        person = {
            'id': idx + 1,
            'name': str(row.get('nombre', '')),
            'artisticName': str(row.get('nombre_artistico', row.get('nombre', ''))),
            'category': str(row.get('categoria', '')),
            'year': str(row.get('fecha_fallecimiento', '')),
            'image': str(row.get('imagen', '/ui/halloffame/default.jpg')),
            'birthplace': str(row.get('lugar_vivo', '')),
            'nationality': str(row.get('nacionalidad', '')),
            'shortDescription': str(row.get('descripcion_corta', '')),
            'fullDescription': str(row.get('descripcion_corta', '')),  # Usa la misma por ahora
            'achievements': [],  # Se puede llenar después
            'quote': str(row.get('frase_celebre', '')),
            'representativeImage': str(row.get('imagen_representativa', '')),
            'secondaryImage': str(row.get('imagen_secundaria', ''))  
        
        # Limpiar valores NaN
        for key, value in person.items():
            if isinstance(value, str) and (value == 'nan' or value == ''):
                person[key] = ''
            elif not isinstance(value, (str, list, dict)):
                try:
                    if pd.isna(value):
                        person[key] = '' if key != 'achievements' else []
                except (ValueError, TypeError):
                    pass
        
        persons.append(person)
    
    # Generar contenido del archivo JS
    js_content = f"""// src/composables/data/Halloffamedata.js
// Generado automáticamente desde Excel

export const hallOfFamePersons = {json.dumps(persons, indent=2, ensure_ascii=False)};

// Categorías disponibles (para filtros)
export const categories = [
  'Todos',
  'General',
  'Ciencia',
  'Arte y Ciencia',
  'Filosofía',
  'Literatura',
  'Música',
  'Política',
  'Guerra'
];
"""
    
    # Guardar archivo
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"✅ Archivo generado exitosamente: {output_path}")
    print(f"📊 Total de personajes: {len(persons)}")
    print(f"\n📋 Columnas procesadas:")
    print(f"   - imagen (principal del timeline)")
    print(f"   - imagen_representativa (primera al abrir detalle)")
    print(f"   - imagen_secundaria (después del click)")
    
    return output_path

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python excel_to_halloffame.py <archivo_excel.xlsx> [archivo_salida.js]")
        print("\nEjemplo:")
        print("  python excel_to_halloffame.py personajes.xlsx")
        print("  python excel_to_halloffame.py personajes.xlsx hallOfFameData.js")
        print("\n📝 Columnas requeridas en Excel:")
        print("  - nombre")
        print("  - nombre_artistico")
        print("  - categoria")
        print("  - fecha_fallecimiento")
        print("  - imagen (foto principal)")
        print("  - lugar_vivo")
        print("  - nacionalidad")
        print("  - descripcion_corta")
        print("  - frase_celebre")
        print("  - imagen_representativa (primera imagen grande)")
        print("  - imagen_secundaria (segunda imagen al hacer click)")
        sys.exit(1)
    
    excel_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'hallOfFameData.js'
    
    if not Path(excel_file).exists():
        print(f"❌ Error: No se encontró el archivo {excel_file}")
        sys.exit(1)
    
    excel_to_halloffame_js(excel_file, output_file)