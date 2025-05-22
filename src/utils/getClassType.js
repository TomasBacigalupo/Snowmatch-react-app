const getClassType = (type) => {
    switch(type) {
        case 'privada':
            return 'Clase Privada';
        case 'grupal':
            return 'Clase Grupal';
        case 'nenes':
            return 'Clase para Niños';
        case 'adolescentes':
            return 'Clase para Adolescentes';
        case 'menores':
            return 'Clase para Menores';
        case 'juveniles':
            return 'Clase para Juveniles';
        default:
            return 'Clase';
    }
}