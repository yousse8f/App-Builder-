'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type Locale = 'en' | 'es' | 'fr';

export const languages = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
] as const;

export const translations = {
  en: {
    nav: {
      features: 'Features',
      howItWorks: 'How It Works',
      templates: 'Templates',
      pricing: 'Pricing',
      faq: 'FAQ',
      login: 'Login',
      getStarted: 'Get Started',
    },
    hero: {
      badge: 'Build. Customize. Launch.',
      titleLine1: 'Build powerful mobile apps',
      titleLine2: 'without the complexity.',
      description: 'Create, customize, and manage mobile applications from one powerful platform designed for modern businesses.',
      cta: 'Get Started Free',
      secondary: 'Explore the Platform',
      secondaryLogin: 'Sign In',
      stats: {
        users: 'Active Users',
        apps: 'Apps Built',
        rating: 'User Rating',
      },
      trustBadges: {
        security: 'Enterprise Security',
        compliance: 'GDPR Compliant',
      },
      dashboard: {
        title: 'App Builder Dashboard',
        live: 'Live',
        projects: 'Projects',
        templates: 'Templates',
        builds: 'Builds',
        active: 'Active',
      },
    },
    trust: {
      title: 'Everything you need to build and manage your apps',
      benefits: [
        { title: 'Fast', description: 'Build and deploy in minutes' },
        { title: 'Secure', description: 'Enterprise-grade security' },
        { title: 'Scalable', description: 'Grow with your business' },
        { title: 'Easy to Manage', description: 'Centralized control' },
      ],
    },
    features: {
      title: 'Everything you need to build and manage your apps',
      subtitle: 'Powerful tools designed to streamline your mobile app development journey',
      available: 'Available',
      comingSoon: 'Coming Soon',
      items: [
        { title: 'Visual App Building', description: 'Build application projects through a centralized platform with intuitive tools.' },
        { title: 'Project Management', description: 'Keep all your applications and projects organized in one workspace.' },
        { title: 'Automated Builds', description: 'Prepare application builds through a centralized workflow.' },
        { title: 'License Management', description: 'Manage application licenses and activation from one place.' },
        { title: 'Client Dashboard', description: 'Monitor projects, builds, and account information.' },
      ],
    },
    howItWorks: {
      title: 'From idea to application in four simple steps',
      subtitle: 'Streamlined workflow to take you from concept to deployed application',
      steps: [
        { title: 'Create your account', description: 'Sign up and set up your App Builder workspace in minutes.' },
        { title: 'Create your application', description: 'Start building your mobile application from scratch.' },
        { title: 'Customize your application', description: 'Tailor the app to your needs with intuitive customization tools.' },
        { title: 'Build and manage your app', description: 'Prepare builds and manage your application lifecycle.' },
      ],
    },
    pricing: {
      title: 'Simple, transparent pricing',
      subtitle: 'Choose the plan that fits your needs. All plans include core features.',
      badge: 'Plans coming soon',
      popular: 'Popular',
      cta: 'Get Started',
      notify: 'Get Notified',
      comingSoonTitle: 'Flexible plans are coming soon',
      comingSoonDescription: "We're working on defining our pricing structure. Our goal is to provide flexible options that suit different needs, from individual developers to businesses.",
      plans: [
        { name: 'Starter', description: 'Perfect for individuals and small projects', price: 'Coming Soon', features: ['Up to 3 projects', 'Community support', 'Build management', 'License management', 'Priority support'] },
        { name: 'Professional', description: 'For growing businesses and teams', price: 'Coming Soon', features: ['Unlimited projects', 'Priority support', 'Build management', 'License management', 'Team collaboration'] },
        { name: 'Business', description: 'For large organizations and enterprises', price: 'Coming Soon', features: ['Unlimited projects', '24/7 dedicated support', 'Build management', 'License management', 'Team collaboration'] },
      ],
    },
    productPreview: {
      title: 'Everything in one workspace',
      subtitle: 'Manage your entire app development pipeline from a single dashboard',
      stats: {
        totalProjects: 'Total Projects',
        active: 'Active',
        building: 'Building',
        drafts: 'Drafts',
      },
      table: {
        project: 'Project',
        platform: 'Platform',
        status: 'Status',
        license: 'License',
      },
      projects: [
        { name: 'E-Commerce App', platform: 'iOS & Android', status: 'Active', license: 'Active' },
        { name: 'Restaurant App', platform: 'iOS & Android', status: 'Building', license: 'Active' },
        { name: 'Fitness Tracker', platform: 'iOS Only', status: 'Draft', license: 'Pending' },
        { name: 'Community Portal', platform: 'iOS & Android', status: 'Active', license: 'Active' },
      ],
    },
    security: {
      title: 'Built with security in mind',
      subtitle: 'Your data and projects are protected with enterprise-grade security measures',
      features: [
        { title: 'Secure Authentication', description: 'Token-based authentication system with access and refresh tokens for secure sessions.' },
        { title: 'Role-Based Access Control', description: 'Admin and client roles ensure proper access permissions and data separation.' },
        { title: 'Protected Client Data', description: 'Your application data and project information are protected with proper access controls.' },
        { title: 'Structured Project Management', description: 'Organized data structure with proper relationships between projects, builds, and licenses.' },
      ],
      footer: 'We continuously improve our security measures to protect your data',
    },
    finalCta: {
      title: 'Ready to build your next app?',
      description: 'Start with App Builder and manage your entire application workflow from one place.',
      cta: 'Get Started Free',
      secondary: 'Sign In',
      trustBadges: ['No credit card required', 'Free trial available', 'Cancel anytime'],
    },
    faq: {
      title: 'Frequently asked questions',
      subtitle: 'Everything you need to know about App Builder',
      items: [
        { question: 'What is App Builder?', answer: 'App Builder is a SaaS platform that allows clients to create and manage mobile applications through a centralized platform. It provides tools for project management, application customization, and build preparation.' },
        { question: 'Who is App Builder for?', answer: 'App Builder is designed for businesses and developers who want to create and manage mobile applications without the complexity of traditional development. It\'s suitable for both technical and non-technical users.' },
        { question: 'Do I need coding experience?', answer: 'App Builder is designed to be accessible to users with varying levels of technical expertise. While some features may benefit from technical knowledge, many aspects of the platform are designed to be user-friendly and intuitive.' },
        { question: 'Can I manage multiple applications?', answer: 'Yes, App Builder allows you to manage multiple projects from a single dashboard. You can organize, track, and manage all your applications in one place.' },
        { question: 'Are automated builds available?', answer: 'The build process is designed to streamline application preparation. Our platform provides centralized workflows for managing and preparing your application builds. This feature is part of our ongoing development.' },
        { question: 'When will licensing be available?', answer: 'License management capabilities are planned for the platform. This will allow you to manage application licenses and activation from one central location. This feature is coming soon.' },
      ],
    },
    footer: {
      product: 'Product',
      company: 'Company',
      resources: 'Resources',
      legal: 'Legal',
      description: 'Build and manage mobile applications with ease.',
      rights: 'All rights reserved.',
      links: {
        product: ['Features', 'Pricing'],
        company: ['About', 'Contact', 'FAQ'],
        resources: ['Documentation', 'Support'],
        legal: ['Privacy Policy', 'Terms of Service'],
      },
    },
    auth: {
      customerTitle: 'Customer Login',
      adminTitle: 'Admin Login',
      headerSubtitle: 'Welcome back to App Builder',
      adminSubtitle: 'Secure access for administrators',
      email: 'Email Address',
      password: 'Password',
      google: 'Google sign-in coming soon',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
      adminPrompt: 'Are you an admin?',
      customerPrompt: 'Need customer access?',
      customerLogin: 'Customer Login',
      customerAccount: 'Create your Customer account',
      adminAccount: 'Create your Admin account',
      customerRegisterSubtitle: 'Start building your apps with a customer account',
      adminRegisterSubtitle: 'Start building and manage your account with full permissions',
      goHome: 'Go to Home',
      createAccount: 'Create Account',
      createAdminAccount: 'Create Admin Account',
      createCustomerAccount: 'Create Customer Account',
      submitCustomerLogin: 'Customer Login',
      submitAdminLogin: 'Admin Login',
      loading: 'Signing in...',
      forgotPassword: 'Forgot password?',
    },
    dashboard: {
      loading: 'Loading...',
      logout: 'Logout',
      adminDashboard: 'Admin Dashboard',
      clientDashboard: 'Client Dashboard',
      welcome: 'Welcome back,',
      admin: 'Admin',
      client: 'Client',
      dashboardLabel: 'Dashboard',
      clients: 'Clients',
      projects: 'Projects',
      templates: 'Templates',
      licenses: 'Licenses',
      builds: 'Builds',
      whmcs: 'WHMCS',
      profile: 'Profile',
      myProjects: 'My Projects',
      defaultUser: 'User',
      defaultAdmin: 'Admin',
      summaryText: "Here's what's happening with your platform today.",
      welcomeBackTo: 'Welcome back to',
      greeting: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' },
      stats: {
        totalClients: 'Total Clients',
        activeClients: 'Active Clients',
        blockedClients: 'Blocked Clients',
        totalProjects: 'Total Projects',
        activeLicenses: 'Active Licenses',
        whmcsConnections: 'WHMCS Connections',
        totalBuilds: 'Total Builds',
        failedBuilds: 'Failed Builds',
        myProjects: 'My Projects',
        availableTemplates: 'Available Templates',
      },
      recent: {
        recentClients: 'Recent Clients',
        recentProjects: 'Recent Projects',
        recentBuilds: 'Recent Builds',
        licenseActivity: 'License Activity',
        quickActions: 'Quick Actions',
        createProject: 'Create New Project',
        browseTemplates: 'Browse Templates',
        gettingStarted: 'Getting Started',
      },
      empty: {
        noRecentClients: 'No recent clients',
        noRecentProjects: 'No recent projects',
        noRecentBuilds: 'No recent builds',
        noLicenseActivity: 'No recent license activity',
        noActiveLicenses: 'No active licenses',
        noRecentText: 'Your applications will appear here once you create your first project.',
        noBuildText: 'Your build history will appear here.',
        noLicenseText: 'License management will be available soon.',
      },
      gettingStarted: {
        step1Title: 'Create your first project',
        step1Desc: 'Start building your mobile application',
        step2Title: 'Customize your application',
        step2Desc: 'Tailor your app to your needs with intuitive tools',
        step3Title: 'Build and deploy',
        step3Desc: 'Prepare builds and manage your application lifecycle',
        licenseStatus: 'License Status',
      },
      appBuilder: {
        startProject: 'Start Project',
        myProjects: 'My Projects',
        save: 'Save',
        export: 'Export',
        delete: 'Delete',
        edit: 'Edit',
        preview: 'Preview',
        back: 'Back',
        screens: 'Screens',
        addScreen: 'Add Screen',
        canvas: 'Canvas',
        properties: 'Properties',
        background: 'Background',
        device: 'Device',
        elements: 'Elements',
        text: 'Text',
        image: 'Image',
        logo: 'Logo',
        shape: 'Shape',
        button: 'Button',
        position: 'Position',
        size: 'Size',
        width: 'Width',
        height: 'Height',
        rotation: 'Rotation',
        opacity: 'Opacity',
        scale: 'Scale',
        font: 'Font',
        fontSize: 'Font Size',
        fontWeight: 'Font Weight',
        color: 'Color',
        alignment: 'Alignment',
        lineHeight: 'Line Height',
        borderRadius: 'Border Radius',
        borderWidth: 'Border Width',
        borderColor: 'Border Color',
        build: 'Build',
        builds: 'Builds',
        createBuild: 'Create Build',
        androidBuild: 'Android Build',
        iosBuild: 'iOS Build',
        download: 'Download',
        projectEditor: 'Project Editor',
        projectName: 'Project Name',
        description: 'Description',
        status: 'Status',
        platform: 'Platform',
        deviceType: 'Device Type',
        orientation: 'Orientation',
        ios: 'iOS',
        android: 'Android',
        both: 'Both',
        portrait: 'Portrait',
        landscape: 'Landscape',
        iphone: 'iPhone',
        ipad: 'iPad',
        androidPhone: 'Android Phone',
        androidTablet: 'Android Tablet',
        screensCount: 'screens',
        startBlankProject: 'Start Blank Project',
        startYourProject: 'Start Your Project',
        noProjectsFound: 'No projects found',
        tryAdjustingFilters: 'Try adjusting your filters or search terms',
        getStartedCreateProject: 'Get started by creating your first project',
        projectCreated: 'Project created successfully!',
        projectSaved: 'Project saved successfully!',
        projectDeleted: 'Project deleted successfully!',
        buildCreated: 'Build created successfully!',
        buildPending: 'Build is pending',
        buildPreparing: 'Build is preparing',
        buildBuilding: 'Build is building',
        buildCompleted: 'Build completed successfully',
        buildFailed: 'Build failed',
        selectScreen: 'Select a screen to edit',
        selectElement: 'Select an element to edit its properties',
        addText: '+ Text',
        addImage: '+ Image',
        addShape: '+ Shape',
        addButton: '+ Button',
        duplicate: 'Duplicate',
        remove: 'Remove',
        createProject: 'Create Project',
        editProject: 'Edit Project',
        viewAll: 'View All',
        noBuildsYet: 'No Builds Yet',
        startBuildingApp: 'Start building your app by creating a project and generating your first build.',
        goToProjects: 'Go to Projects',
        buildHistory: 'Build History',
        viewAndDownloadBuilds: 'View and download your application builds',
        createYourFirstBuild: 'Create your first build',
        yourBuildsWillAppear: 'Your build history will appear here.',
      },
    },
  },
  es: {
    nav: { features: 'Funciones', howItWorks: 'Cómo funciona', templates: 'Plantillas', pricing: 'Precios', faq: 'Preguntas frecuentes', login: 'Iniciar sesión', getStarted: 'Comenzar' },
    hero: { badge: 'Construye. Personaliza. Lanza.', titleLine1: 'Crea aplicaciones móviles poderosas', titleLine2: 'sin la complejidad.', description: 'Crea, personaliza y gestiona aplicaciones móviles desde una sola plataforma diseñada para negocios modernos.', cta: 'Comienza gratis', secondary: 'Explora la plataforma', secondaryLogin: 'Iniciar sesión', stats: { users: 'Usuarios activos', apps: 'Apps creadas', rating: 'Valoración de usuarios' }, trustBadges: { security: 'Seguridad empresarial', compliance: 'Cumplimiento GDPR' }, dashboard: { title: 'Panel de App Builder', live: 'En vivo', projects: 'Proyectos', templates: 'Plantillas', builds: 'Compilaciones', active: 'Activo' } },
    trust: { title: 'Todo lo que necesitas para crear y gestionar tus apps', benefits: [{ title: 'Rápido', description: 'Construye y despliega en minutos' }, { title: 'Seguro', description: 'Seguridad de nivel empresarial' }, { title: 'Escalable', description: 'Crece con tu negocio' }, { title: 'Fácil de gestionar', description: 'Control centralizado' }] },
    features: { title: 'Todo lo que necesitas para crear y gestionar tus apps', subtitle: 'Herramientas potentes para simplificar el desarrollo de aplicaciones móviles', available: 'Disponible', comingSoon: 'Próximamente', items: [{ title: 'Creación visual de apps', description: 'Construye proyectos de aplicación desde una plataforma centralizada con herramientas intuitivas.' }, { title: 'Gestión de proyectos', description: 'Mantén todas tus aplicaciones y proyectos organizados en un mismo espacio de trabajo.' }, { title: 'Compilaciones automatizadas', description: 'Prepara compilaciones de aplicaciones mediante un flujo centralizado.' }, { title: 'Gestión de licencias', description: 'Administra licencias y activaciones de aplicaciones desde un solo lugar.' }, { title: 'Panel del cliente', description: 'Supervisa proyectos, compilaciones e información de la cuenta.' }] },
    howItWorks: { title: 'De la idea a la aplicación en cuatro pasos sencillos', subtitle: 'Flujo optimizado para llevarte desde el concepto hasta la aplicación desplegada', steps: [{ title: 'Crea tu cuenta', description: 'Regístrate y configura tu espacio de trabajo de App Builder en minutos.' }, { title: 'Crea tu aplicación', description: 'Empieza a construir tu aplicación móvil desde cero.' }, { title: 'Personaliza tu aplicación', description: 'Adapta la app a tus necesidades con herramientas intuitivas.' }, { title: 'Construye y gestiona tu app', description: 'Prepara compilaciones y gestiona el ciclo de vida de tu aplicación.' }] },
    pricing: { title: 'Precios simples y transparentes', subtitle: 'Elige el plan que mejor se adapte a tus necesidades. Todos incluyen funciones esenciales.', badge: 'Los planes estarán disponibles pronto', popular: 'Popular', cta: 'Comenzar', notify: 'Recibir notificación', comingSoonTitle: 'Los planes flexibles llegarán pronto', comingSoonDescription: 'Estamos definiendo nuestra estructura de precios. Nuestro objetivo es ofrecer opciones flexibles para distintos perfiles, desde desarrolladores individuales hasta empresas.', plans: [{ name: 'Inicial', description: 'Perfecto para individuos y proyectos pequeños', price: 'Próximamente', features: ['Hasta 3 proyectos', 'Soporte de la comunidad', 'Gestión de compilaciones', 'Gestión de licencias', 'Soporte prioritario'] }, { name: 'Profesional', description: 'Para negocios en crecimiento y equipos', price: 'Próximamente', features: ['Proyectos ilimitados', 'Soporte prioritario', 'Gestión de compilaciones', 'Gestión de licencias', 'Colaboración en equipo'] }, { name: 'Empresarial', description: 'Para organizaciones grandes y empresas', price: 'Próximamente', features: ['Proyectos ilimitados', 'Soporte dedicado 24/7', 'Gestión de compilaciones', 'Gestión de licencias', 'Colaboración en equipo'] }] },
    productPreview: { title: 'Todo en un mismo espacio de trabajo', subtitle: 'Gestiona todo tu flujo de desarrollo desde un único panel', stats: { totalProjects: 'Total de proyectos', active: 'Activos', building: 'En construcción', drafts: 'Borradores' }, table: { project: 'Proyecto', platform: 'Plataforma', status: 'Estado', license: 'Licencia' }, projects: [{ name: 'App de comercio', platform: 'iOS y Android', status: 'Activo', license: 'Activo' }, { name: 'App de restaurante', platform: 'iOS y Android', status: 'En construcción', license: 'Activo' }, { name: 'Rastreador fitness', platform: 'Solo iOS', status: 'Borrador', license: 'Pendiente' }, { name: 'Portal comunitario', platform: 'iOS y Android', status: 'Activo', license: 'Activo' }] },
    security: { title: 'Diseñado con seguridad en mente', subtitle: 'Tus datos y proyectos están protegidos con medidas de seguridad de nivel empresarial', features: [{ title: 'Autenticación segura', description: 'Sistema de autenticación basado en tokens con accesos y renovaciones para sesiones seguras.' }, { title: 'Control de acceso por roles', description: 'Los roles de administrador y cliente garantizan permisos adecuados y separación de datos.' }, { title: 'Datos protegidos del cliente', description: 'La información de tu aplicación y proyectos está protegida con controles de acceso adecuados.' }, { title: 'Gestión estructurada de proyectos', description: 'Estructura de datos organizada con relaciones claras entre proyectos, compilaciones y licencias.' }], footer: 'Mejoramos continuamente nuestras medidas de seguridad para proteger tus datos' },
    finalCta: { title: '¿Listo para crear tu próxima app?', description: 'Empieza con App Builder y gestiona todo tu flujo de aplicaciones desde un solo lugar.', cta: 'Comienza gratis', secondary: 'Iniciar sesión', trustBadges: ['Sin tarjeta de crédito', 'Prueba gratuita disponible', 'Cancela en cualquier momento'] },
    faq: { title: 'Preguntas frecuentes', subtitle: 'Todo lo que necesitas saber sobre App Builder', items: [{ question: '¿Qué es App Builder?', answer: 'App Builder es una plataforma SaaS que permite crear y gestionar aplicaciones móviles a través de una plataforma centralizada. Proporciona herramientas de gestión de proyectos, personalización de aplicaciones y preparación de compilaciones.' }, { question: '¿Para quién es App Builder?', answer: 'App Builder está pensado para negocios y desarrolladores que quieren crear y gestionar aplicaciones móviles sin la complejidad del desarrollo tradicional. Es útil tanto para usuarios técnicos como no técnicos.' }, { question: '¿Necesito experiencia en programación?', answer: 'App Builder está diseñado para ser accesible para usuarios con distintos niveles de experiencia técnica. Aunque algunas funciones pueden requerir conocimientos técnicos, muchas partes de la plataforma están pensadas para ser intuitivas y fáciles de usar.' }, { question: '¿Puedo gestionar varias aplicaciones?', answer: 'Sí, App Builder te permite gestionar varios proyectos desde un solo panel. Puedes organizar, seguir y administrar todas tus aplicaciones en un mismo lugar.' }, { question: '¿Hay compilaciones automáticas?', answer: 'El proceso de compilación está diseñado para optimizar la preparación de aplicaciones. Nuestra plataforma ofrece flujos centralizados para gestionar y preparar tus builds. Esta funcionalidad forma parte de nuestro desarrollo continuo.' }, { question: '¿Cuándo estará disponible la gestión de licencias?', answer: 'La gestión de licencias está planificada en la plataforma. Esto te permitirá administrar licencias y activaciones desde un único lugar. Esta funcionalidad llegará próximamente.' }] },
    footer: { product: 'Producto', company: 'Empresa', resources: 'Recursos', legal: 'Legal', description: 'Crea y gestiona aplicaciones móviles con facilidad.', rights: 'Todos los derechos reservados.', links: { product: ['Funciones', 'Precios'], company: ['Acerca de', 'Contacto', 'Preguntas frecuentes'], resources: ['Documentación', 'Soporte'], legal: ['Política de privacidad', 'Términos del servicio'] } },
    auth: { customerTitle: 'Inicio de sesión del cliente', adminTitle: 'Inicio de sesión del administrador', headerSubtitle: 'Bienvenido de nuevo a App Builder', adminSubtitle: 'Acceso seguro para administradores', email: 'Correo electrónico', password: 'Contraseña', google: 'Google inicio de sesión próximamente', noAccount: '¿No tienes una cuenta?', signUp: 'Regístrate', adminPrompt: '¿Eres administrador?', customerPrompt: '¿Necesitas acceso del cliente?', customerLogin: 'Inicio de sesión del cliente', customerAccount: 'Crea tu cuenta de cliente', adminAccount: 'Crea tu cuenta de administrador', customerRegisterSubtitle: 'Empieza a crear tus apps con una cuenta de cliente', adminRegisterSubtitle: 'Empieza a crear y gestionar tu cuenta con todos los permisos', goHome: 'Ir a inicio', createAccount: 'Crear cuenta', createAdminAccount: 'Crear cuenta de administrador', createCustomerAccount: 'Crear cuenta de cliente', submitCustomerLogin: 'Iniciar sesión', submitAdminLogin: 'Iniciar sesión de administrador', loading: 'Iniciando sesión...', forgotPassword: '¿Olvidaste tu contraseña?' },
    dashboard: { loading: 'Cargando...', logout: 'Cerrar sesión', adminDashboard: 'Panel de administración', clientDashboard: 'Panel del cliente', welcome: 'Bienvenido de nuevo,', admin: 'Administrador', client: 'Cliente', dashboardLabel: 'Panel', clients: 'Clientes', projects: 'Proyectos', templates: 'Plantillas', licenses: 'Licencias', builds: 'Compilaciones', whmcs: 'WHMCS', profile: 'Perfil', myProjects: 'Mis proyectos', defaultUser: 'Usuario', defaultAdmin: 'Administrador', summaryText: 'Así está avanzando tu plataforma hoy.', welcomeBackTo: 'Bienvenido a', greeting: { morning: 'Buenos días', afternoon: 'Buenas tardes', evening: 'Buenas noches' }, stats: { totalClients: 'Total de clientes', activeClients: 'Clientes activos', blockedClients: 'Clientes bloqueados', totalProjects: 'Total de proyectos', activeLicenses: 'Licencias activas', whmcsConnections: 'Conexiones WHMCS', totalBuilds: 'Total de builds', failedBuilds: 'Builds fallidos', myProjects: 'Mis proyectos', availableTemplates: 'Plantillas disponibles' }, recent: { recentClients: 'Clientes recientes', recentProjects: 'Proyectos recientes', recentBuilds: 'Builds recientes', licenseActivity: 'Actividad de licencias', quickActions: 'Acciones rápidas', createProject: 'Crear nuevo proyecto', browseTemplates: 'Explorar plantillas', gettingStarted: 'Primeros pasos' }, empty: { noRecentClients: 'No hay clientes recientes', noRecentProjects: 'No hay proyectos recientes', noRecentBuilds: 'No hay builds recientes', noLicenseActivity: 'No hay actividad reciente de licencias', noActiveLicenses: 'No hay licencias activas', noRecentText: 'Tus aplicaciones aparecerán aquí cuando crees tu primer proyecto.', noBuildText: 'Tu historial de builds aparecerá aquí.', noLicenseText: 'La gestión de licencias estará disponible pronto.' }, gettingStarted: { step1Title: 'Crea tu primer proyecto', step1Desc: 'Empieza a construir tu aplicación móvil', step2Title: 'Personaliza tu aplicación', step2Desc: 'Adapta tu app a tus necesidades con herramientas intuitivas', step3Title: 'Personaliza y construye', step3Desc: 'Adapta tu app y prepárala para el despliegue', licenseStatus: 'Estado de licencias' } },

  },
  fr: {
    nav: { features: 'Fonctionnalités', howItWorks: 'Comment ça marche', templates: 'Modèles', pricing: 'Tarifs', faq: 'FAQ', login: 'Connexion', getStarted: 'Commencer' },
    hero: { badge: 'Créez. Personnalisez. Lançez.', titleLine1: 'Créez des applications mobiles puissantes', titleLine2: 'sans la complexité.', description: 'Créez, personnalisez et gérez des applications mobiles depuis une seule plateforme pensée pour les entreprises modernes.', cta: 'Commencer gratuitement', secondary: 'Explorer la plateforme', secondaryLogin: 'Se connecter', stats: { users: 'Utilisateurs actifs', apps: 'Applications créées', rating: 'Note des utilisateurs' }, trustBadges: { security: 'Sécurité d’entreprise', compliance: 'Conformité RGPD' }, dashboard: { title: 'Tableau de bord App Builder', live: 'En direct', projects: 'Projets', templates: 'Modèles', builds: 'Builds', active: 'Actif' } },
    trust: { title: 'Tout ce dont vous avez besoin pour créer et gérer vos apps', benefits: [{ title: 'Rapide', description: 'Créez et déployez en quelques minutes' }, { title: 'Sécurisé', description: 'Sécurité de niveau entreprise' }, { title: 'Scalable', description: 'Grandissez avec votre entreprise' }, { title: 'Facile à gérer', description: 'Contrôle centralisé' }] },
    features: { title: 'Tout ce dont vous avez besoin pour créer et gérer vos apps', subtitle: 'Des outils puissants pour simplifier le développement d’applications mobiles', available: 'Disponible', comingSoon: 'Bientôt', items: [{ title: 'Création visuelle d’applications', description: 'Créez des projets d’application via une plateforme centralisée et des outils intuitifs.' }, { title: 'Modèles prêts à l’emploi', description: 'Commencez plus vite avec des modèles conçus par des professionnels pour divers secteurs.' }, { title: 'Gestion de projets', description: 'Gardez toutes vos applications et projets organisés dans un même espace de travail.' }, { title: 'Builds automatiques', description: 'Préparez les builds d’application via un workflow centralisé.' }, { title: 'Gestion des licences', description: 'Gérez les licences et activations depuis un seul endroit.' }, { title: 'Tableau de bord client', description: 'Surveillez projets, builds, modèles et informations de compte.' }] },
    howItWorks: { title: 'De l’idée à l’application en quatre étapes simples', subtitle: 'Un workflow simplifié pour passer du concept à l’application déployée', steps: [{ title: 'Créez votre compte', description: 'Inscrivez-vous et configurez votre espace App Builder en quelques minutes.' }, { title: 'Choisissez un modèle', description: 'Sélectionnez des modèles conçus professionnellement pour démarrer rapidement.' }, { title: 'Personnalisez votre application', description: 'Adaptez l’application à vos besoins grâce à des outils intuitifs.' }, { title: 'Créez et gérez votre application', description: 'Préparez les builds et gérez le cycle de vie de votre application.' }] },
    templates: { title: 'Commencez par un modèle. Faites-le vôtre.', subtitle: 'Choisissez des modèles conçus professionnellement pour accélérer votre développement', preview: 'Aperçu', comingSoon: 'Le système de modèles arrive bientôt', items: [{ name: 'Business', category: 'Professionnel', description: 'Applications d’entreprise et de services avec des fonctionnalités professionnelles.' }, { name: 'Restaurant', category: 'Restauration', description: 'Système complet de gestion et de commande pour restaurant.' }, { name: 'E-commerce', category: 'Commerce', description: 'Boutique en ligne complète avec intégration de paiement.' }, { name: 'Éducation', category: 'Apprentissage', description: 'Plateformes pédagogiques et systèmes de gestion de l’apprentissage.' }, { name: 'Communauté', category: 'Social', description: 'Fonctionnalités de création de communauté et réseaux sociaux.' }, { name: 'Services', category: 'Business', description: 'Applications de réservation et gestion de services.' }] },
    pricing: { title: 'Des tarifs simples et transparents', subtitle: 'Choisissez le plan qui correspond à vos besoins. Tous les plans incluent les fonctionnalités de base.', badge: 'Les plans arrivent bientôt', popular: 'Populaire', cta: 'Commencer', notify: 'Être notifié', comingSoonTitle: 'Des plans flexibles arrivent bientôt', comingSoonDescription: 'Nous travaillons sur la définition de notre structure tarifaire. Notre objectif est de proposer des options flexibles adaptées à différents besoins, des particuliers aux entreprises.', plans: [{ name: 'Starter', description: 'Idéal pour particuliers et petits projets', price: 'Bientôt', features: ['Jusqu’à 3 projets', 'Modèles de base', 'Support communautaire', 'Gestion des builds', 'Gestion des licences', 'Support prioritaire'] }, { name: 'Professionnel', description: 'Pour les entreprises en croissance et les équipes', price: 'Bientôt', features: ['Projets illimités', 'Tous les modèles', 'Support prioritaire', 'Gestion des builds', 'Gestion des licences', 'Collaboration d’équipe'] }, { name: 'Business', description: 'Pour les grandes organisations et entreprises', price: 'Bientôt', features: ['Projets illimités', 'Tous les modèles', 'Support dédié 24/7', 'Gestion des builds', 'Gestion des licences', 'Collaboration d’équipe'] }] },
    productPreview: { title: 'Tout dans un seul espace de travail', subtitle: 'Gérez toute votre pipeline de développement depuis un seul tableau de bord', stats: { totalProjects: 'Total des projets', active: 'Actif', building: 'En construction', drafts: 'Brouillons' }, table: { project: 'Projet', platform: 'Plateforme', template: 'Modèle', status: 'Statut', license: 'Licence' }, projects: [{ name: 'Application e-commerce', platform: 'iOS et Android', template: 'Business', status: 'Actif', license: 'Actif' }, { name: 'Application restaurant', platform: 'iOS et Android', template: 'Restaurant', status: 'En construction', license: 'Actif' }, { name: 'Suivi fitness', platform: 'iOS uniquement', template: 'Santé', status: 'Brouillon', license: 'En attente' }, { name: 'Portail communautaire', platform: 'iOS et Android', template: 'Communauté', status: 'Actif', license: 'Actif' }] },
    security: { title: 'Conçu avec la sécurité en tête', subtitle: 'Vos données et projets sont protégés par des mesures de sécurité de niveau entreprise', features: [{ title: 'Authentification sécurisée', description: 'Système d’authentification basé sur des tokens avec accès et rafraîchissement pour des sessions sécurisées.' }, { title: 'Contrôle d’accès par rôle', description: 'Les rôles administrateur et client garantissent les droits d’accès appropriés et la séparation des données.' }, { title: 'Données client protégées', description: 'Les données de votre application et de vos projets sont protégées par des contrôles d’accès adaptés.' }, { title: 'Gestion structurée des projets', description: 'Structure de données organisée avec des relations claires entre projets, builds et licences.' }], footer: 'Nous améliorons continuellement nos mesures de sécurité pour protéger vos données' },
    finalCta: { title: 'Prêt à créer votre prochaine application ?', description: 'Commencez avec App Builder et gérez tout votre workflow applicatif depuis un seul endroit.', cta: 'Commencer gratuitement', secondary: 'Se connecter', trustBadges: ['Sans carte bancaire', 'Essai gratuit disponible', 'Annulation à tout moment'] },
    faq: { title: 'Questions fréquentes', subtitle: 'Tout ce que vous devez savoir sur App Builder', items: [{ question: 'Qu’est-ce qu’App Builder ?', answer: 'App Builder est une plateforme SaaS qui permet aux clients de créer et gérer des applications mobiles via une plateforme centralisée. Elle fournit des outils de gestion de projets, de personnalisation et de préparation des builds.' }, { question: 'À qui s’adresse App Builder ?', answer: 'App Builder est conçu pour les entreprises et les développeurs qui souhaitent créer et gérer des applications mobiles sans la complexité du développement traditionnel. Il convient aussi bien aux utilisateurs techniques qu’aux non-techniciens.' }, { question: 'Ai-je besoin d’une expérience en programmation ?', answer: 'App Builder est conçu pour être accessible aux utilisateurs ayant des niveaux d’expertise technique variés. Bien que certaines fonctionnalités puissent bénéficier de compétences techniques, de nombreux aspects de la plateforme sont pensés pour être simples et intuitifs.' }, { question: 'Puis-je gérer plusieurs applications ?', answer: 'Oui, App Builder vous permet de gérer plusieurs projets depuis un seul tableau de bord. Vous pouvez organiser, suivre et gérer toutes vos applications en un seul endroit.' }, { question: 'Les builds automatiques sont-ils disponibles ?', answer: 'Le processus de build est conçu pour simplifier la préparation des applications. Notre plateforme fournit des workflows centralisés pour gérer et préparer vos builds. Cette fonctionnalité fait partie de notre développement en cours.' }, { question: 'Quand la gestion des licences sera-t-elle disponible ?', answer: 'La gestion des licences est prévue sur la plateforme. Cela vous permettra de gérer les licences et l’activation des applications depuis un seul endroit. Cette fonctionnalité arrive bientôt.' }] },
    footer: { product: 'Produit', company: 'Entreprise', resources: 'Ressources', legal: 'Légal', description: 'Créez et gérez des applications mobiles en toute simplicité.', rights: 'Tous droits réservés.', links: { product: ['Fonctionnalités', 'Modèles', 'Tarifs'], company: ['À propos', 'Contact', 'FAQ'], resources: ['Documentation', 'Support'], legal: ['Politique de confidentialité', 'Conditions d’utilisation'] } },
    auth: { customerTitle: 'Connexion client', adminTitle: 'Connexion administrateur', headerSubtitle: 'Bon retour sur App Builder', adminSubtitle: 'Accès sécurisé pour les administrateurs', email: 'Adresse e-mail', password: 'Mot de passe', google: 'Connexion Google bientôt disponible', noAccount: 'Vous n’avez pas de compte ?', signUp: 'S’inscrire', adminPrompt: 'Vous êtes administrateur ?', customerPrompt: 'Vous avez besoin d’un accès client ?', customerLogin: 'Connexion client', customerAccount: 'Créez votre compte client', adminAccount: 'Créez votre compte administrateur', customerRegisterSubtitle: 'Commencez à créer vos applications avec un compte client', adminRegisterSubtitle: 'Commencez à gérer votre compte avec tous les droits', goHome: 'Retour à l’accueil', createAccount: 'Créer un compte', createAdminAccount: 'Créer un compte administrateur', createCustomerAccount: 'Créer un compte client', submitCustomerLogin: 'Connexion client', submitAdminLogin: 'Connexion administrateur', loading: 'Connexion en cours...', forgotPassword: 'Mot de passe oublié ?' },
    dashboard: { loading: 'Chargement...', logout: 'Déconnexion', adminDashboard: 'Tableau de bord admin', clientDashboard: 'Tableau de bord client', welcome: 'Bon retour,', admin: 'Administrateur', client: 'Client', dashboardLabel: 'Tableau de bord', clients: 'Clients', projects: 'Projets', templates: 'Modèles', licenses: 'Licences', builds: 'Builds', settings: 'Paramètres', profile: 'Profil', myProjects: 'Mes projets', defaultUser: 'Utilisateur', defaultAdmin: 'Administrateur', summaryText: 'Voici ce qui se passe sur votre plateforme aujourd’hui.', welcomeBackTo: 'Bon retour sur', greeting: { morning: 'Bonjour', afternoon: 'Bon après-midi', evening: 'Bonsoir' }, stats: { totalClients: 'Total clients', activeClients: 'Clients actifs', blockedClients: 'Clients bloqués', totalProjects: 'Total projets', activeLicenses: 'Licences actives', totalBuilds: 'Total builds', failedBuilds: 'Builds en échec', myProjects: 'Mes projets', availableTemplates: 'Modèles disponibles' }, recent: { recentClients: 'Clients récents', recentProjects: 'Projets récents', recentBuilds: 'Builds récents', licenseActivity: 'Activité des licences', quickActions: 'Actions rapides', createProject: 'Créer un nouveau projet', browseTemplates: 'Parcourir les modèles', gettingStarted: 'Premiers pas' }, empty: { noRecentClients: 'Aucun client récent', noRecentProjects: 'Aucun projet récent', noRecentBuilds: 'Aucun build récent', noLicenseActivity: 'Aucune activité récente sur les licences', noActiveLicenses: 'Aucune licence active', noRecentText: 'Vos applications apparaîtront ici une fois que vous aurez créé votre premier projet.', noBuildText: 'Votre historique de builds apparaîtra ici.', noLicenseText: 'La gestion des licences sera bientôt disponible.' }, gettingStarted: { step1Title: 'Créez votre premier projet', step1Desc: 'Commencez à construire votre application mobile', step2Title: 'Choisissez un modèle', step2Desc: 'Sélectionnez parmi nos modèles conçus professionnellement', step3Title: 'Personnalisez et construisez', step3Desc: 'Adaptez votre application et préparez son déploiement', licenseStatus: 'Statut des licences' } }, 
  },
} as const;

type TranslationBundle = (typeof translations)[Locale];

const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationBundle;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') {
      return 'en';
    }

    const saved = window.localStorage.getItem('app-builder-locale') as Locale | null;
    const fallback = 'en';
    return saved && (saved === 'en' || saved === 'es' || saved === 'fr') ? saved : fallback;
  });

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    localStorage.setItem('app-builder-locale', nextLocale);
    document.documentElement.lang = nextLocale;
  };

  const value = useMemo(() => ({ locale, setLocale, t: translations[locale] }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}
