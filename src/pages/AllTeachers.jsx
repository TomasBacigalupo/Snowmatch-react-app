import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AllTeachers = () => {
    const theme = useTheme();

    const teachers = [
        { id: 'kari-1027', name: 'Kari', slug: 'kari-1027' },
        { id: 'juan-manuel-7', name: 'Juan Manuel', slug: 'juan-manuel-7' },
        { id: 'snowmatch-8', name: 'Snowmatch', slug: 'snowmatch-8' },
        { id: 'benito-9', name: 'Benito', slug: 'benito-9' },
        { id: 'iara-11', name: 'Iara', slug: 'iara-11' },
        { id: 'benito-12', name: 'Benito', slug: 'benito-12' },
        { id: 'pedro-13', name: 'Pedro', slug: 'pedro-13' },
        { id: 'tomas-14', name: 'Tomas', slug: 'tomas-14' },
        { id: 'matias-15', name: 'Matias', slug: 'matias-15' },
        { id: 'gaston-16', name: 'Gaston', slug: 'gaston-16' },
        { id: 'santiago-17', name: 'Santiago', slug: 'santiago-17' },
        { id: 'valentina-18', name: 'Valentina', slug: 'valentina-18' },
        { id: 'juan-facundo-19', name: 'Juan Facundo', slug: 'juan-facundo-19' },
        { id: 'santiago-20', name: 'Santiago', slug: 'santiago-20' },
        { id: 'coco-21', name: 'Coco', slug: 'coco-21' },
        { id: 'santiago-22', name: 'Santiago', slug: 'santiago-22' },
        { id: 'matthias-23', name: 'Matthias', slug: 'matthias-23' },
        { id: 'maite-24', name: 'Maite', slug: 'maite-24' },
        { id: 'catalina-25', name: 'Catalina', slug: 'catalina-25' },
        { id: 'alexei-26', name: 'Alexei', slug: 'alexei-26' },
        { id: 'snow-27', name: 'Snow', slug: 'snow-27' },
        { id: 'gisela-28', name: 'Gisela', slug: 'gisela-28' },
        { id: 'rosario-29', name: 'Rosario', slug: 'rosario-29' },
        { id: 'tomas-30', name: 'Tomas', slug: 'tomas-30' },
        { id: 'joaquin-32', name: 'Joaquin', slug: 'joaquin-32' },
        { id: 'camila-33', name: 'Camila', slug: 'camila-33' },
        { id: 'andres-34', name: 'Andres', slug: 'andres-34' },
        { id: 'ignacio-35', name: 'Ignacio', slug: 'ignacio-35' },
        { id: 'mariano-36', name: 'Mariano', slug: 'mariano-36' },
        { id: 'jorge-38', name: 'Jorge', slug: 'jorge-38' },
        { id: 'manuel-39', name: 'Manuel', slug: 'manuel-39' },
        { id: 'celina-40', name: 'Celina', slug: 'celina-40' },
        { id: 'luis-41', name: 'Luis', slug: 'luis-41' },
        { id: 'carolina-43', name: 'Carolina', slug: 'carolina-43' },
        { id: 'juana-44', name: 'Juana', slug: 'juana-44' },
        { id: 'nuria-45', name: 'Nuria', slug: 'nuria-45' },
        { id: 'ramiro-46', name: 'Ramiro', slug: 'ramiro-46' },
        { id: 'dalmiro-47', name: 'Dalmiro', slug: 'dalmiro-47' },
        { id: 'pablo-48', name: 'Pablo', slug: 'pablo-48' },
        { id: 'robin-49', name: 'Robin', slug: 'robin-49' },
        { id: 'lucia-50', name: 'Lucia', slug: 'lucia-50' },
        { id: 'juan-pablo-51', name: 'Juan Pablo', slug: 'juan-pablo-51' },
        { id: 'tincho-56', name: 'Tincho', slug: 'tincho-56' },
        { id: 'romina-73', name: 'Romina', slug: 'romina-73' },
        { id: 'facundo-74', name: 'Facundo', slug: 'facundo-74' },
        { id: 'maite-75', name: 'Maite', slug: 'maite-75' },
        { id: 'teo-76', name: 'Teo', slug: 'teo-76' },
        { id: 'ignacio-77', name: 'Ignacio', slug: 'ignacio-77' },
        { id: 'anabella-78', name: 'Anabella', slug: 'anabella-78' },
        { id: 'agustina-79', name: 'Agustina', slug: 'agustina-79' },
        { id: 'maria-80', name: 'Maria', slug: 'maria-80' },
        { id: 'fernando-81', name: 'Fernando', slug: 'fernando-81' },
        { id: 'matias-83', name: 'Matias', slug: 'matias-83' },
        { id: 'martina-84', name: 'Martina', slug: 'martina-84' },
        { id: 'xiara-85', name: 'Xiara', slug: 'xiara-85' },
        { id: 'agustin-86', name: 'Agustin', slug: 'agustin-86' },
        { id: 'fernando-87', name: 'Fernando', slug: 'fernando-87' },
        { id: 'fermin-88', name: 'Fermin', slug: 'fermin-88' },
        { id: 'diego-89', name: 'Diego', slug: 'diego-89' },
        { id: 'rodrigo-90', name: 'Rodrigo', slug: 'rodrigo-90' },
        { id: 'esti-91', name: 'Esti', slug: 'esti-91' },
        { id: 'julian-92', name: 'Julian', slug: 'julian-92' },
        { id: 'ignacio-93', name: 'Ignacio', slug: 'ignacio-93' },
        { id: 'agustin-94', name: 'Agustin', slug: 'agustin-94' },
        { id: 'juani-95', name: 'Juani', slug: 'juani-95' },
        { id: 'rodrigo-96', name: 'Rodrigo', slug: 'rodrigo-96' },
        { id: 'mauro-97', name: 'Mauro', slug: 'mauro-97' },
        { id: 'zoe-98', name: 'Zoe', slug: 'zoe-98' },
        { id: 'marcelo-99', name: 'Marcelo', slug: 'marcelo-99' },
        { id: 'joaquin-100', name: 'Joaquin', slug: 'joaquin-100' },
        { id: 'enzo-101', name: 'Enzo', slug: 'enzo-101' },
        { id: 'valentin-102', name: 'Valentin', slug: 'valentin-102' },
        { id: 'marc-103', name: 'Marc', slug: 'marc-103' },
        { id: 'bernardo-104', name: 'Bernardo', slug: 'bernardo-104' },
        { id: 'franco-105', name: 'Franco', slug: 'franco-105' },
        { id: 'luciano-106', name: 'Luciano', slug: 'luciano-106' },
        { id: 'maria-belen-107', name: 'Maria Belen', slug: 'maria-belen-107' },
        { id: 'federico-108', name: 'Federico', slug: 'federico-108' },
        { id: 'mikaela-109', name: 'Mikaela', slug: 'mikaela-109' },
        { id: 'sebastian-110', name: 'Sebastian', slug: 'sebastian-110' },
        { id: 'martin-111', name: 'Martin', slug: 'martin-111' },
        { id: 'lautaro-112', name: 'Lautaro', slug: 'lautaro-112' },
        { id: 'nayla-113', name: 'Nayla', slug: 'nayla-113' },
        { id: 'luca-116', name: 'Luca', slug: 'luca-116' },
        { id: 'nicolas-117', name: 'Nicolas', slug: 'nicolas-117' },
        { id: 'juanchi-118', name: 'Juanchi', slug: 'juanchi-118' },
        { id: 'lautaro-119', name: 'Lautaro', slug: 'lautaro-119' },
        { id: 'manu-120', name: 'Manu', slug: 'manu-120' },
        { id: 'manu-121', name: 'Manu', slug: 'manu-121' },
        { id: 'tomas-122', name: 'Tomas', slug: 'tomas-122' },
        { id: 'rodrigo-123', name: 'Rodrigo', slug: 'rodrigo-123' },
        { id: 'renata-124', name: 'Renata', slug: 'renata-124' },
        { id: 'juan-pablo-125', name: 'Juan Pablo', slug: 'juan-pablo-125' },
        { id: 'damian-126', name: 'Damian', slug: 'damian-126' },
        { id: 'jorge-omar-127', name: 'Jorge Omar', slug: 'jorge-omar-127' },
        { id: 'juan-cruz-128', name: 'Juan Cruz', slug: 'juan-cruz-128' },
        { id: 'juan-manuel-129', name: 'Juan Manuel', slug: 'juan-manuel-129' },
        { id: 'ilios-130', name: 'Ilios', slug: 'ilios-130' },
        { id: 'matias-131', name: 'Matias', slug: 'matias-131' },
        { id: 'lucio-132', name: 'Lucio', slug: 'lucio-132' },
        { id: 'manu-133', name: 'Manu', slug: 'manu-133' },
        { id: 'zoel-134', name: 'Zoel', slug: 'zoel-134' },
        { id: 'valentina-135', name: 'Valentina', slug: 'valentina-135' },
        { id: 'leandro-136', name: 'Leandro', slug: 'leandro-136' },
        { id: 'gabriel-137', name: 'Gabriel', slug: 'gabriel-137' },
        { id: 'patricio-138', name: 'Patricio', slug: 'patricio-138' },
        { id: 'lucio-139', name: 'Lucio', slug: 'lucio-139' },
        { id: 'lucio-140', name: 'Lucio', slug: 'lucio-140' },
        { id: 'nataly-141', name: 'Nataly', slug: 'nataly-141' },
        { id: 'paula-142', name: 'Paula', slug: 'paula-142' },
        { id: 'fernando-143', name: 'Fernando', slug: 'fernando-143' },
        { id: 'gaspar-144', name: 'Gaspar', slug: 'gaspar-144' },
        { id: 'juana-145', name: 'Juana', slug: 'juana-145' },
        { id: 'simon-146', name: 'Simon', slug: 'simon-146' },
        { id: 'alejo-147', name: 'Alejo', slug: 'alejo-147' },
        { id: 'francisco-158', name: 'Francisco', slug: 'francisco-158' },
        { id: 'santiago-159', name: 'Santiago', slug: 'santiago-159' },
        { id: 'sebastian-162', name: 'Sebastian', slug: 'sebastian-162' },
        { id: 'nicolas-163', name: 'Nicolas', slug: 'nicolas-163' },
        { id: 'azul-167', name: 'Azul', slug: 'azul-167' },
        { id: 'victoria-173', name: 'Victoria', slug: 'victoria-173' },
        { id: 'inali-174', name: 'Inali', slug: 'inali-174' },
        { id: 'camila-175', name: 'Camila', slug: 'camila-175' },
        { id: 'jose-179', name: 'Jose', slug: 'jose-179' },
        { id: 'marina-180', name: 'Marina', slug: 'marina-180' },
        { id: 'jose-183', name: 'Jose', slug: 'jose-183' },
        { id: 'luciano-184', name: 'Luciano', slug: 'luciano-184' },
        { id: 'juan-cruz-185', name: 'Juan Cruz', slug: 'juan-cruz-185' },
        { id: 'tati-200', name: 'Tati', slug: 'tati-200' },
        { id: 'maria-201', name: 'Maria', slug: 'maria-201' },
        { id: 'jonatan-202', name: 'Jonatan', slug: 'jonatan-202' },
        { id: 'santiago-aramis-203', name: 'Santiago Aramis', slug: 'santiago-aramis-203' },
        { id: 'julian-204', name: 'Julian', slug: 'julian-204' },
        { id: 'alba-205', name: 'Alba', slug: 'alba-205' },
        { id: 'matias-206', name: 'Matias', slug: 'matias-206' },
        { id: 'manuel-207', name: 'Manuel', slug: 'manuel-207' },
        { id: 'juan-208', name: 'Juan', slug: 'juan-208' },
        { id: 'olivia-209', name: 'Olivia', slug: 'olivia-209' },
        { id: 'manuel-212', name: 'Manuel', slug: 'manuel-212' },
        { id: 'daniela-214', name: 'Daniela', slug: 'daniela-214' },
        { id: 'greg-216', name: 'Greg', slug: 'greg-216' },
        { id: 'test-217', name: 'Test', slug: 'test-217' },
        { id: 'juan-martin-220', name: 'Juan Martin', slug: 'juan-martin-220' },
        { id: 'victoria-229', name: 'Victoria', slug: 'victoria-229' },
        { id: 'sofia-234', name: 'Sofia', slug: 'sofia-234' },
        { id: 'miriam-235', name: 'Miriam', slug: 'miriam-235' },
        { id: 'gabriel-242', name: 'Gabriel', slug: 'gabriel-242' },
        { id: 'agustin-243', name: 'Agustin', slug: 'agustin-243' },
        { id: 'francesco-245', name: 'Francesco', slug: 'francesco-245' },
        { id: 'pablo-246', name: 'Pablo', slug: 'pablo-246' },
        { id: 'matias-247', name: 'Matias', slug: 'matias-247' },
        { id: 'jaime-248', name: 'Jaime', slug: 'jaime-248' },
        { id: 'manuel-249', name: 'Manuel', slug: 'manuel-249' },
        { id: 'juan-251', name: 'Juan', slug: 'juan-251' },
        { id: 'christian-252', name: 'Christian', slug: 'christian-252' },
        { id: 'sebastian-262', name: 'Sebastian', slug: 'sebastian-262' },
        { id: 'alejo-271', name: 'Alejo', slug: 'alejo-271' },
        { id: 'lucas-277', name: 'Lucas', slug: 'lucas-277' },
        { id: 'maria-belen-278', name: 'Maria Belen', slug: 'maria-belen-278' },
        { id: 'julian-280', name: 'Julian', slug: 'julian-280' },
        { id: 'sol-281', name: 'Sol', slug: 'sol-281' },
        { id: 'gino-282', name: 'Gino', slug: 'gino-282' },
        { id: 'martina-283', name: 'Martina', slug: 'martina-283' },
        { id: 'jose-284', name: 'Jose', slug: 'jose-284' },
        { id: 'augusto-286', name: 'Augusto', slug: 'augusto-286' },
        { id: 'santiago-287', name: 'Santiago', slug: 'santiago-287' },
        { id: 'sabrina-288', name: 'Sabrina', slug: 'sabrina-288' },
        { id: 'mateo-289', name: 'Mateo', slug: 'mateo-289' },
        { id: 'bautista-290', name: 'Bautista', slug: 'bautista-290' },
        { id: 'ramiro-nicolas-292', name: 'Ramiro Nicolas', slug: 'ramiro-nicolas-292' },
        { id: 'aldana-293', name: 'Aldana', slug: 'aldana-293' },
        { id: 'felipe-294', name: 'Felipe', slug: 'felipe-294' },
        { id: 'antonio-nicolas-295', name: 'Antonio Nicolas', slug: 'antonio-nicolas-295' },
        { id: 'lucas-296', name: 'Lucas', slug: 'lucas-296' },
        { id: 'manuel-297', name: 'Manuel', slug: 'manuel-297' },
        { id: 'bautista-alejandro-301', name: 'Bautista Alejandro', slug: 'bautista-alejandro-301' },
        { id: 'ramiro-esteban-304', name: 'Ramiro Esteban', slug: 'ramiro-esteban-304' },
        { id: 'lukas-306', name: 'Lukas', slug: 'lukas-306' },
        { id: 'juan-pablo-308', name: 'Juan Pablo', slug: 'juan-pablo-308' },
        { id: 'sebastian-310', name: 'Sebastian', slug: 'sebastian-310' },
        { id: 'matias-311', name: 'Matias', slug: 'matias-311' },
        { id: 'pablo-gaston-313', name: 'Pablo Gaston', slug: 'pablo-gaston-313' },
        { id: 'esteban-326', name: 'Esteban', slug: 'esteban-326' },
        { id: 'alejandro-332', name: 'Alejandro', slug: 'alejandro-332' },
        { id: 'felipe-337', name: 'Felipe', slug: 'felipe-337' },
        { id: 'estanislao-347', name: 'Estanislao', slug: 'estanislao-347' },
        { id: 'mariana-349', name: 'Mariana', slug: 'mariana-349' },
        { id: 'pilar-350', name: 'Pilar', slug: 'pilar-350' },
        { id: 'luis-360', name: 'Luis', slug: 'luis-360' },
        { id: 'gabriel-guchi-362', name: 'Gabriel Guchi', slug: 'gabriel-guchi-362' },
        { id: 'luciano-363', name: 'Luciano', slug: 'luciano-363' },
        { id: 'fernando-364', name: 'Fernando', slug: 'fernando-364' },
        { id: 'dario-365', name: 'Dario', slug: 'dario-365' },
        { id: 'sofia-367', name: 'Sofia', slug: 'sofia-367' },
        { id: 'manuel-382', name: 'Manuel', slug: 'manuel-382' },
        { id: 'martina-383', name: 'Martina', slug: 'martina-383' },
        { id: 'felipe-392', name: 'Felipe', slug: 'felipe-392' },
        { id: 'tomas-397', name: 'Tomas', slug: 'tomas-397' },
        { id: 'roman-398', name: 'Roman', slug: 'roman-398' },
        { id: 'juan-pablo-400', name: 'Juan Pablo', slug: 'juan-pablo-400' },
        { id: 'agustin-402', name: 'Agustin', slug: 'agustin-402' },
        { id: 'amadeo-404', name: 'Amadeo', slug: 'amadeo-404' },
        { id: 'ramiro-405', name: 'Ramiro', slug: 'ramiro-405' },
        { id: 'manu-407', name: 'Manu', slug: 'manu-407' },
        { id: 'giusseppe-408', name: 'Giusseppe', slug: 'giusseppe-408' },
        { id: 'matias-409', name: 'Matias', slug: 'matias-409' },
        { id: 'sebastian-414', name: 'Sebastian', slug: 'sebastian-414' },
        { id: 'nina-420', name: 'Nina', slug: 'nina-420' },
        { id: 'nicolas-422', name: 'Nicolas', slug: 'nicolas-422' },
        { id: 'eva-425', name: 'Eva', slug: 'eva-425' },
        { id: 'zoe-428', name: 'Zoe', slug: 'zoe-428' },
        { id: 'expertos-435', name: 'Expertos', slug: 'expertos-435' },
        { id: 'marko-451', name: 'Marko', slug: 'marko-451' },
        { id: 'matias-452', name: 'Matias', slug: 'matias-452' },
        { id: 'juan-ignacio-459', name: 'Juan Ignacio', slug: 'juan-ignacio-459' },
        { id: 'cecilia-461', name: 'Cecilia', slug: 'cecilia-461' },
        { id: 'agustin-473', name: 'Agustin', slug: 'agustin-473' },
        { id: 'santiago-480', name: 'Santiago', slug: 'santiago-480' },
        { id: 'leandro-504', name: 'Leandro', slug: 'leandro-504' },
        { id: 'agustina-506', name: 'Agustina', slug: 'agustina-506' },
        { id: 'lucia-536', name: 'Lucia', slug: 'lucia-536' },
        { id: 'gonzalo-563', name: 'Gonzalo', slug: 'gonzalo-563' },
        { id: 'federico-577', name: 'Federico', slug: 'federico-577' },
        { id: 'carolina-582', name: 'Carolina', slug: 'carolina-582' },
        { id: 'nicol-583', name: 'Nicol', slug: 'nicol-583' },
        { id: 'lukas-584', name: 'Lukas', slug: 'lukas-584' },
        { id: 'lukas-585', name: 'Lukas', slug: 'lukas-585' },
        { id: 'sofia-592', name: 'Sofia', slug: 'sofia-592' },
        { id: 'manuela-595', name: 'Manuela', slug: 'manuela-595' },
        { id: 'julia-596', name: 'Julia', slug: 'julia-596' },
        { id: 'rodrigo-fabian-597', name: 'Rodrigo Fabian', slug: 'rodrigo-fabian-597' },
        { id: 'ramiro-601', name: 'Ramiro', slug: 'ramiro-601' },
        { id: 'ilios-603', name: 'Ilios', slug: 'ilios-603' },
        { id: 'jose-604', name: 'Jose', slug: 'jose-604' },
        { id: 'delfina-605', name: 'Delfina', slug: 'delfina-605' },
        { id: 'florencia-607', name: 'Florencia', slug: 'florencia-607' },
        { id: 'paloma-608', name: 'Paloma', slug: 'paloma-608' },
        { id: 'agustin-609', name: 'Agustin', slug: 'agustin-609' },
        { id: 'diego-610', name: 'Diego', slug: 'diego-610' },
        { id: 'german-alonso-613', name: 'German Alonso', slug: 'german-alonso-613' },
        { id: 'paula-615', name: 'Paula', slug: 'paula-615' },
        { id: 'carolina-616', name: 'Carolina', slug: 'carolina-616' },
        { id: 'federico-619', name: 'Federico', slug: 'federico-619' },
        { id: 'adolfo-ariel-623', name: 'Adolfo Ariel', slug: 'adolfo-ariel-623' },
        { id: 'adolfo-ariel-624', name: 'Adolfo Ariel', slug: 'adolfo-ariel-624' },
        { id: 'sebastian-625', name: 'Sebastian', slug: 'sebastian-625' },
        { id: 'lucas-626', name: 'Lucas', slug: 'lucas-626' },
        { id: 'danisa-631', name: 'Danisa', slug: 'danisa-631' },
        { id: 'muriel-633', name: 'Muriel', slug: 'muriel-633' },
        { id: 'marcos-634', name: 'Marcos', slug: 'marcos-634' },
        { id: 'juan-pablo-635', name: 'Juan Pablo', slug: 'juan-pablo-635' },
        { id: 'matias-637', name: 'Matias', slug: 'matias-637' },
        { id: 'anabella-641', name: 'Anabella', slug: 'anabella-641' },
        { id: 'martin-645', name: 'Martin', slug: 'martin-645' },
        { id: 'gonzalo-647', name: 'Gonzalo', slug: 'gonzalo-647' },
        { id: 'manuel-648', name: 'Manuel', slug: 'manuel-648' },
        { id: 'maite-653', name: 'Maite', slug: 'maite-653' },
        { id: 'franco-655', name: 'Franco', slug: 'franco-655' },
        { id: 'ailin-670', name: 'Ailin', slug: 'ailin-670' },
        { id: 'camila-672', name: 'Camila', slug: 'camila-672' },
        { id: 'carlos-emanuel-678', name: 'Carlos Emanuel', slug: 'carlos-emanuel-678' },
        { id: 'juan-sebastian-679', name: 'Juan Sebastian', slug: 'juan-sebastian-679' },
        { id: 'juan-manuel-680', name: 'Juan Manuel', slug: 'juan-manuel-680' },
        { id: 'facundo-681', name: 'Facundo', slug: 'facundo-681' },
        { id: 'francisco-andres-682', name: 'Francisco Andres', slug: 'francisco-andres-682' },
        { id: 'santiago-683', name: 'Santiago', slug: 'santiago-683' },
        { id: 'antonella-684', name: 'Antonella', slug: 'antonella-684' },
        { id: 'luis-685', name: 'Luis', slug: 'luis-685' },
        { id: 'juan-cruz-lirio-686', name: 'Juan Cruz Lirio', slug: 'juan-cruz-lirio-686' },
        { id: 'agustina-687', name: 'Agustina', slug: 'agustina-687' },
        { id: 'luciana-688', name: 'Luciana', slug: 'luciana-688' },
        { id: 'juan-690', name: 'Juan', slug: 'juan-690' },
        { id: 'gonzalo-702', name: 'Gonzalo', slug: 'gonzalo-702' },
        { id: 'lucas-704', name: 'Lucas', slug: 'lucas-704' },
        { id: 'manuel-721', name: 'Manuel', slug: 'manuel-721' },
        { id: 'adam-726', name: 'Adam', slug: 'adam-726' },
        { id: 'marcos-728', name: 'Marcos', slug: 'marcos-728' },
        { id: 'evezambrano-745', name: 'Evezambrano', slug: 'evezambrano-745' },
        { id: 'esteban-750', name: 'Esteban', slug: 'esteban-750' },
        { id: 'julieta-752', name: 'Julieta', slug: 'julieta-752' },
        { id: 'facundo-matias-761', name: 'Facundo Matias', slug: 'facundo-matias-761' },
        { id: 'alvaro-763', name: 'Alvaro', slug: 'alvaro-763' },
        { id: 'sofia-768', name: 'Sofia', slug: 'sofia-768' },
        { id: 'victoria-773', name: 'Victoria', slug: 'victoria-773' },
        { id: 'juan-pablo-782', name: 'Juan Pablo', slug: 'juan-pablo-782' },
        { id: 'nicolas-828', name: 'Nicolas', slug: 'nicolas-828' },
        { id: 'test-840', name: 'Test', slug: 'test-840' },
        { id: 'lucas-844', name: 'Lucas', slug: 'lucas-844' },
        { id: 'federica-846', name: 'Federica', slug: 'federica-846' },
        { id: 'test-847', name: 'Test', slug: 'test-847' },
        { id: 'joaquin-848', name: 'Joaquin', slug: 'joaquin-848' },
        { id: 'eusebio-849', name: 'Eusebio', slug: 'eusebio-849' },
        { id: 'thiago-850', name: 'Thiago', slug: 'thiago-850' },
        { id: 'vicenc-879', name: 'Vicenc', slug: 'vicenc-879' },
        { id: 'pablo-andres-890', name: 'Pablo Andres', slug: 'pablo-andres-890' },
        { id: 'agos-897', name: 'Agos', slug: 'agos-897' },
        { id: 'diego-899', name: 'Diego', slug: 'diego-899' },
        { id: 'lucia-sopelana-901', name: 'Lucia Sopelana', slug: 'lucia-sopelana-901' },
        { id: 'martin-902', name: 'Martin', slug: 'martin-902' },
        { id: 'gonzalo-903', name: 'Gonzalo', slug: 'gonzalo-903' },
        { id: 'sebastian-904', name: 'Sebastian', slug: 'sebastian-904' },
        { id: 'tadeo-905', name: 'Tadeo', slug: 'tadeo-905' },
        { id: 'juan-ignacio-909', name: 'Juan Ignacio', slug: 'juan-ignacio-909' },
        { id: 'marcos-910', name: 'Marcos', slug: 'marcos-910' },
        { id: 'carlos-joaquin-912', name: 'Carlos Joaquin', slug: 'carlos-joaquin-912' },
        { id: 'francisco-918', name: 'Francisco', slug: 'francisco-918' },
        { id: 'ski-la-plata-936', name: 'Ski La Plata', slug: 'ski-la-plata-936' },
        { id: 'ski-baires-937', name: 'Ski Baires', slug: 'ski-baires-937' },
        { id: 'tadeo-944', name: 'Tadeo', slug: 'tadeo-944' },
        { id: 'jason-947', name: 'Jason', slug: 'jason-947' },
        { id: 'franco-958', name: 'Franco', slug: 'franco-958' },
        { id: 'oriana-974', name: 'Oriana', slug: 'oriana-974' },
        { id: 'lola-miranda-977', name: 'Lola Miranda', slug: 'lola-miranda-977' },
        { id: 'malena-1013', name: 'Malena', slug: 'malena-1013' },
        { id: 'sofia-1014', name: 'Sofia', slug: 'sofia-1014' },
        { id: 'catalina-1018', name: 'Catalina', slug: 'catalina-1018' },
        { id: 'kari-1027', name: 'Kari', slug: 'kari-1027' },
        { id: 'pedro-1029', name: 'Pedro', slug: 'pedro-1029' },
        { id: 'gonzalo-1031', name: 'Gonzalo', slug: 'gonzalo-1031' },
        { id: 'luciano-1043', name: 'Luciano', slug: 'luciano-1043' }
    ];

    const resorts = [
        { name: 'Portillo', slug: 'portillo' },
        { name: 'Bariloche', slug: 'bariloche' },
        { name: 'Lago Hermoso', slug: 'lago-hermoso' },
        { name: 'Cerro Bayo', slug: 'cerro-bayo' },
        { name: 'Cerro Catedral', slug: 'cerro-catedral' },
        { name: 'Perito Moreno', slug: 'perito-moreno' },
        { name: 'Las Leñas', slug: 'las-leñas' },
        { name: 'Chapelco', slug: 'chapelco' },
        { name: 'Cerro Catedral', slug: 'cerro-catedral' },
        { name: 'Cerro Bayo', slug: 'cerro-bayo' },
        { name: 'Lago Hermoso', slug: 'lago-hermoso' },
        { name: 'Bariloche', slug: 'bariloche' },
        { name: 'Portillo', slug: 'portillo' },
        { name: 'Perito Moreno', slug: 'perito-moreno' },
        
    ];

    const languages = [
        { code: 'es', name: 'Español', prefix: '' },
        { code: 'pt', name: 'Português', prefix: '/pt' },
        { code: 'en', name: 'English', prefix: '/en' },
    ];

    return (
        <>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom align="center">
                    Todos los Profesores y Resorts
                </Typography>
                
                {/* Teachers Section */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
                        Profesores de Ski
                    </Typography>
                    <Grid container spacing={3}>
                        {teachers.map((teacher) => (
                            <Grid item xs={12} md={6} lg={4} key={teacher.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {teacher.name}
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            {languages.map((lang) => (
                                                <Box key={lang.code} sx={{ mb: 1 }}>
                                                    <Link
                                                        href={`${lang.prefix}/reservar-clase-ski/${teacher.slug}`}
                                                        color="primary"
                                                        underline="hover"
                                                        sx={{ display: 'block' }}
                                                    >
                                                        {lang.name}: Reservar clase con {teacher.name}
                                                    </Link>
                                                </Box>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Resorts Section */}
                <Box>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
                        Resorts de Ski
                    </Typography>
                    <Grid container spacing={3}>
                        {resorts.map((resort) => (
                            <Grid item xs={12} md={6} lg={4} key={resort.slug}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {resort.name}
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            {languages.map((lang) => (
                                                <Box key={lang.code} sx={{ mb: 1 }}>
                                                    <Link
                                                        href={`${lang.prefix}/${resort.slug}`}
                                                        color="primary"
                                                        underline="hover"
                                                        sx={{ display: 'block' }}
                                                    >
                                                        {lang.name}: {resort.name}
                                                    </Link>
                                                </Box>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* SEO Links Section - Hidden but accessible to crawlers */}
                <Box sx={{ mt: 6, opacity: 0.7 }}>
                    <Typography variant="h5" gutterBottom>
                        Enlaces para SEO
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {/* Teacher booking links */}
                        <Link href="/reservar-clase-ski/kari-1027" color="inherit" sx={{ fontSize: '0.875rem' }}>
                            Reservar clase con Kari
                        </Link>
                        
                        {/* Resort links in Spanish */}
                        <Link href="/portillo" color="inherit" sx={{ fontSize: '0.875rem' }}>
                            Portillo
                        </Link>
                        <Link href="/bariloche" color="inherit" sx={{ fontSize: '0.875rem' }}>
                            Bariloche
                        </Link>
                        <Link href="/lago-hermoso" color="inherit" sx={{ fontSize: '0.875rem' }}>
                            Lago Hermoso
                        </Link>
                        <Link href="/cerro-bayo" color="inherit" sx={{ fontSize: '0.875rem' }}>
                            Cerro Bayo
                        </Link>

                        {/* Resort links in Portuguese */}
                        <Link href="/pt/portillo" color="inherit" sx={{ fontSize: '0.875rem' }}>
                            Portillo(PT)
                        </Link>
                        <Link href="/pt/bariloche" color="inherit" sx={{ fontSize: '0.875rem' }}>
                            Bariloche(PT)
                        </Link>
                        <Link href="/pt/lago-hermoso" color="inherit" sx={{ fontSize: '0.875rem' }}>
                            Lago Hermoso(PT)
                        </Link>
                        <Link href="/pt/cerro-bayo" color="inherit" sx={{ fontSize: '0.875rem' }}>
                            Cerro Bayo(PT)
                        </Link>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default AllTeachers;
