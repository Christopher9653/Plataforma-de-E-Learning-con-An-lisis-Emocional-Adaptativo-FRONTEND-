export default function FooterComponents() {
  return (
      <footer className="bg-gray-800 dark:bg-zinc-950 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EduEmotion</h3>
              <p className="text-gray-400">
                Plataforma de E-Learning con Análisis Emocional Adaptativo
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#inicio" className="hover:text-white">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="#informacion" className="hover:text-white">
                    Información
                  </a>
                </li>
                <li>
                  <a href="#nosotros" className="hover:text-white">
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a href="#mision" className="hover:text-white">
                    Misión & Visión
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Términos de Servicio
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@eduemotion.com</li>
                <li>+1 (555) 123-4567</li>
                <li>Ciudad Educativa, ED 12345</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduEmotion. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
  );
}

