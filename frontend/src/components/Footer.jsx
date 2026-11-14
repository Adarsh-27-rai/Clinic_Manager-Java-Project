function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="text-slate-500 text-sm font-medium">
          © {new Date().getFullYear()} Clinic Management System
        </p>
        <p className="text-slate-400 text-xs mt-1">Built with Spring Boot & React</p>
      </div>
    </footer>
  )
}

export default Footer
