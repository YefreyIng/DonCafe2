# Configuración de Imágenes para Productos

Para que el upload de imágenes funcione correctamente, necesitas ejecutar el SQL actualizado en Supabase.

## 🔧 Pasos a seguir

### 1. Abre la consola SQL de Supabase
- Ve a tu proyecto en Supabase
- Haz clic en **SQL Editor**
- Selecciona **New query**

### 2. Copia el contenido de `supabase/schema.sql`
- Abre el archivo `supabase/schema.sql` en tu editor
- Copia **TODO el contenido**

### 3. Pega en la consola SQL
- Pega el contenido en la ventana de SQL
- Haz clic en **Run**

Esto creará o actualizará:
- ✅ Tabla `products` con columna `image_url`
- ✅ Bucket `product-images` en Storage (público)
- ✅ Políticas RLS para lectura pública y administración autenticada
- ✅ Todas las otras tablas y funciones

## 📝 Flujo del Upload de Imágenes

1. **Admin sube imagen** en el formulario "Nuevo producto"
   - Selecciona una imagen JPG/PNG/GIF/WebP
   - Ves un preview de la imagen

2. **Sistema procesa la imagen**
   - Convierte a Data URL (cliente)
   - Genera nombre único con timestamp
   - Sube a Supabase Storage (`product-images` bucket)

3. **Se guarda el producto**
   - Obtiene URL pública de la imagen
   - Guarda el producto con `image_url` en la tabla `products`

4. **Tienda carga dinámicamente**
   - Hook `useProducts` obtiene todos los productos activos
   - Muestra imagen en la tarjeta del producto
   - Si no hay imagen, muestra ícono de café (SVG fallback)

## 🖼️ Características de Imágenes

✨ **Preview inmediato** - Ves la imagen antes de guardar  
📦 **Optimización automática** - Se guarda en JPEG comprimido  
🔗 **URLs públicas** - Se pueden compartir directamente  
🎨 **Fallback elegante** - SVG de café si falta imagen  
📱 **Responsive** - Se adapta a cualquier tamaño de pantalla  
⚡ **Lazy loading** - Las imágenes se cargan solo cuando son visibles  

## 📂 Ubicación de Archivos Modificados

- `supabase/schema.sql` — Bucket y políticas RLS añadidas
- `src/pages/Admin.tsx` — Upload de imagen en ProductModal
- `src/components/sections/Products.tsx` — Display de imágenes con fallback

## ❓ Preguntas Frecuentes

**¿Qué tipos de archivo se aceptan?**  
JPG, PNG, GIF, WebP. Se recomienda JPG para mejor compresión.

**¿Hay límite de tamaño?**  
Supabase Storage permite hasta 50MB por archivo por defecto. Es más que suficiente para imágenes de productos.

**¿Las imágenes son públicas?**  
Sí, están en el bucket `product-images` configurado como público. Cualquiera puede verlas pero solo admins pueden subirlas.

**¿Qué pasa si no subo una imagen?**  
El producto se crea sin imagen. La tienda mostrará un ícono de café en su lugar.

---

✅ Una vez ejecutes el SQL, el sistema está listo para imágenes.
