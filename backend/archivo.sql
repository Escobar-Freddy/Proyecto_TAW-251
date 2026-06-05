-- Insertar 5 usuarios de prueba
INSERT INTO usuarios (
        nombre,
        apellido_paterno,
        apellido_materno,
        direccion,
        celular,
        edad,
        distrito,
        region,
        iglesia,
        email,
        password_hash,
        password_strength,
        rol,
        activo
    )
VALUES (
        'Freddy Elias',
        'Escobar',
        'Catunta',
        'C/La Paz Z/Munaypata Av. Principal 100, #200',
        '73084626',
        42,
        '2 La Paz',
        'El Alto 1',
        'Los Pescadores',
        'fescobarc@fcpn.edu.bo',
        '$2a$10$bDXR1MhTQJDAdSIoDxWUA.EIUVV4d5ifSwLvM9KpK4sA6GB4AuCSO',
        'strong',
        'admin',
        true
    ),
    (
        'Tatiana',
        'Blanco',
        'Escobar',
        'Calle 6 de Agosto 456, Sopocachi',
        '75201492',
        36,
        '1 La Paz ',
        'La Paz',
        'Los Andes',
        'tatiana01@gmail.com',
        '$2a$10$uAMvWXM.Xf8TTLt.AjqESuSCGy0Bl9RTnZyR4uszvUO6M7BZFPRFi',
        'strong',
        'tesorero',
        true
    ),
    (
        'Mariel',
        'Ibarra',
        'Quispe',
        'Av. Heroinas 789, Miraflores',
        '71977412',
        38,
        '2 Distrito',
        'El Alto 1',
        'Dios es Amor',
        'marisitaib@gmial.com',
        '$2a$10$RJ2dR5Em4A9Qj0Dgm4RWPO4x6byDSnChS3swwI0hphHdxQfIJYueG',
        'strong',
        'usuario',
        true
    ) --== == == == == == == == == == == == == == == == == == == == == == == == 
    -- Insertar cuentas principales (si no existen)
INSERT INTO cuentas_contables (codigo, nombre, tipo, nivel, descripcion)
VALUES (
        '300',
        'DIEZMOS',
        'ingreso',
        1,
        'Ingresos provenientes por diezmos en efectivo'
    ),
    (
        '310',
        'OFRENDAS',
        'ingreso',
        1,
        'Ingresos regulares que provienen de ofrendas'
    ),
    (
        '320',
        'OTROS INGRESOS',
        'ingreso',
        1,
        'Ingresos no clasificados: Primicias, donaciones, ventas'
    ),
    (
        '322',
        'APORTES',
        'ingreso',
        2,
        'Aportes anuales del Ministerio de la Mujer y Ejecutivo Distrital'
    ),
    (
        '323',
        'VENTAS',
        'ingreso',
        2,
        'Venta de manuales, camisas, poleras, kits'
    ),
    (
        '321',
        'CURSOS O ACTIVIDADES',
        'ingreso',
        2,
        'Ingresos por inscripción a cursos'
    ),
    (
        '400',
        'OBLIGACIONES ADMINISTRATIVAS',
        'egreso',
        1,
        'Pago del diezmo 10% del total de ingresos'
    ),
    (
        '410',
        'GASTOS MINISTERIALES',
        'egreso',
        1,
        'Ofrenda ministerial, transporte, alimentación'
    ),
    (
        '420',
        'APORTES Y OFRENDAS DE AMOR',
        'egreso',
        1,
        'Aportes a misiones, Foomaad, ayuda social'
    ),
    (
        '430',
        'GASTOS DE CAPITAL',
        'egreso',
        1,
        'Adquisición de activos fijos'
    ),
    (
        '440',
        'GASTOS GENERALES',
        'egreso',
        1,
        'Material de oficina, servicios básicos'
    ),
    (
        '450',
        'OTROS GASTOS',
        'egreso',
        1,
        'Gastos poco usuales'
    ),
    (
        '412',
        'ALIMENTACION',
        'egreso',
        2,
        'Gastos de alimentación en eventos'
    ),
    (
        '441',
        'MATERIAL OFICINA',
        'egreso',
        2,
        'Compra de material de oficina y papelería'
    ),
    (
        '452',
        'COMPRAS VARIAS',
        'egreso',
        2,
        'Compras de materiales varios'
    ) ON CONFLICT (codigo) DO NOTHING;
-- Actualizar relaciones padre-hijo
UPDATE cuentas_contables
SET id_cuenta_padre = (
        SELECT id_cuenta
        FROM cuentas_contables
        WHERE codigo = '320'
    )
WHERE codigo IN ('321', '322', '323');
--== == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == =
INSERT INTO movimientos (
        id_usuario_registra,
        id_cuenta,
        tipo,
        monto,
        descripcion,
        fecha_movimiento,
        numero_recibo
    )
VALUES (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '320'
        ),
        'ingreso',
        8728.60,
        'Saldo Anterior - mes de Marzo',
        '2026-03-31',
        'SALDO-001'
    );
--== == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == ==
INSERT INTO movimientos (
        id_usuario_registra,
        id_cuenta,
        tipo,
        monto,
        descripcion,
        fecha_movimiento,
        numero_recibo,
        persona_origen
    )
VALUES (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        40.00,
        'venta de falda (1 unid.)',
        '2026-04-08',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        40.00,
        'venta de manual',
        '2026-04-12',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '322'
        ),
        'ingreso',
        152.80,
        'Aporte Presbítero Distrital',
        '2026-04-15',
        '1892',
        'Presbítero Distrital'
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        35.00,
        'Venta de morral (1 unid.)',
        '2026-04-15',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        150.00,
        'Venta de mochila (2 unid.)',
        '2026-04-15',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        70.00,
        'Venta de mochila (1 unid.)',
        '2026-04-15',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        40.00,
        'Venta de polera (1 unid.)',
        '2026-04-22',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        70.00,
        'Venta de morrales (2 unid.)',
        '2026-04-22',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        15.00,
        'Venta de manual alumna (1 unid.)',
        '2026-04-22',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '300'
        ),
        'ingreso',
        300.06,
        'Diezmo - Diciembre Región 1 (atrasado 2025)',
        '2026-04-24',
        '52707',
        'Región 1'
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '300'
        ),
        'ingreso',
        606.73,
        'Diezmo - Enero Región 1',
        '2026-04-29',
        '52708',
        'Región 1'
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '300'
        ),
        'ingreso',
        1120.79,
        'Diezmo - Febrero Región 1',
        '2026-04-29',
        '52709',
        'Región 1'
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '322'
        ),
        'ingreso',
        172.23,
        'Aporte Presbítero Distrital',
        '2026-04-30',
        '1944',
        'Presbítero Distrital'
    );
--== == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == ==
INSERT INTO movimientos (
        id_usuario_registra,
        id_cuenta,
        tipo,
        monto,
        descripcion,
        fecha_movimiento,
        numero_recibo
    )
VALUES (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '441'
        ),
        'egreso',
        25.00,
        'Compra de manual Arco Iris (actualizado)',
        '2026-04-03',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '441'
        ),
        'egreso',
        225.00,
        'Compra de Kit de Siervas',
        '2026-04-03',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '441'
        ),
        'egreso',
        161.00,
        'Compra de manuales de Consejeras (5 unid.)',
        '2026-04-12',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '452'
        ),
        'egreso',
        150.00,
        'Compra de Vidrio (reposicion -oficina distrital)',
        '2026-04-16',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '452'
        ),
        'egreso',
        70.00,
        'Compra de presente (Aniversario Min. Mujer)',
        '2026-04-16',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '452'
        ),
        'egreso',
        100.00,
        'Pago por servicio (Colocado de chapa)',
        '2026-04-16',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '441'
        ),
        'egreso',
        169.00,
        'Compra de material de escritorio',
        '2026-04-19',
        '90650'
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '410'
        ),
        'egreso',
        120.00,
        'Gastos de representacion (2 personas)',
        '2026-04-22',
        NULL
    );
--== == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == =
INSERT INTO movimientos (
        id_usuario_registra,
        id_cuenta,
        tipo,
        monto,
        descripcion,
        fecha_movimiento,
        numero_recibo
    )
VALUES (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '320'
        ),
        'ingreso',
        10521.21,
        'Saldo Anterior - mes de Abril',
        '2026-04-30',
        'SALDO-002'
    );
--== == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == =
INSERT INTO movimientos (
        id_usuario_registra,
        id_cuenta,
        tipo,
        monto,
        descripcion,
        fecha_movimiento,
        numero_recibo,
        persona_origen
    )
VALUES (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '300'
        ),
        'ingreso',
        24.00,
        'Diezmo - Marzo Región Los Andes Murillo',
        '2026-05-13',
        '5259',
        'Región Los Andes Murillo'
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '300'
        ),
        'ingreso',
        24.00,
        'Diezmo - Abril Región Los Andes Murillo',
        '2026-05-13',
        '5260',
        'Región Los Andes Murillo'
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '300'
        ),
        'ingreso',
        24.00,
        'Diezmo - Mayo Región Los Andes Murillo',
        '2026-05-13',
        '5261',
        'Región Los Andes Murillo'
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        40.00,
        'Venta de manual de Consejera (1 unid.)',
        '2026-05-13',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        58.00,
        'Venta de falda (1unid.); estuchera (1 unid.)',
        '2026-05-13',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '300'
        ),
        'ingreso',
        40.80,
        'Diezmo - Febrero Región 2 EL ALTO',
        '2026-05-13',
        '5255',
        'Región 2 EL ALTO'
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '300'
        ),
        'ingreso',
        134.81,
        'Diezmo - Marzo Región 2 EL ALTO',
        '2026-05-13',
        '5256',
        'Región 2 EL ALTO'
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '310'
        ),
        'ingreso',
        30.00,
        'Ofrenda de Amor (IgI. Roca de mi Salvacion)',
        '2026-05-14',
        NULL,
        'Iglesia Roca de mi Salvación'
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '300'
        ),
        'ingreso',
        20.00,
        'Diezmo - enero Región Norte Pacajes',
        '2026-05-20',
        '5262',
        'Región Norte Pacajes'
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '300'
        ),
        'ingreso',
        20.00,
        'Diezmo - febrero Región Norte Pacajes',
        '2026-05-20',
        '5263',
        'Región Norte Pacajes'
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        60.00,
        'Venta de estucheras (4 unid.)',
        '2026-05-20',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        615.00,
        'Venta de 3 kits- Manual de Siervas',
        '2026-05-20',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        45.00,
        'Venta de Manuales de Rosas Alumna (3 unid.)',
        '2026-05-20',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        45.00,
        'Venta de Manuales - margaritas (3 unid.)',
        '2026-05-20',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        80.00,
        'Venta de Manuales - consejeras (2 unid.)',
        '2026-05-20',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '321'
        ),
        'ingreso',
        1425.00,
        'Curso de entrenamiento para Siervas (Inscripcion)',
        '2026-05-25',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '321'
        ),
        'ingreso',
        10.00,
        'Presentacion a Examen - Consejera de Siervas (1 persona)',
        '2026-05-25',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        240.00,
        'Venta de faldas Siervas (6 unid.)',
        '2026-05-25',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        70.00,
        'Venta de morrales (2 unid.)',
        '2026-05-27',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        80.00,
        'Venta manual de consejeras (2 unid.)',
        '2026-05-27',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '323'
        ),
        'ingreso',
        410.00,
        'Venta de manuales de Siervas - 2 kits',
        '2026-05-27',
        NULL,
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '322'
        ),
        'ingreso',
        167.00,
        'Aporte Presbitero Distrital',
        '2026-05-31',
        '1998',
        'Presbítero Distrital'
    );
--== == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == == ==
INSERT INTO movimientos (
        id_usuario_registra,
        id_cuenta,
        tipo,
        monto,
        descripcion,
        fecha_movimiento,
        numero_recibo
    )
VALUES (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '441'
        ),
        'egreso',
        20.00,
        'compra de manual de Dorcas (1 unid.)',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '441'
        ),
        'egreso',
        350.60,
        'Compra de 2 kits de manual de Siervas (22 unid.)',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '441'
        ),
        'egreso',
        78.40,
        'Compra de Manuales tomo I - Rosas (7 unid.)',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '441'
        ),
        'egreso',
        118.00,
        'Compra de Manuales de Siervas (8 unid.)',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '441'
        ),
        'egreso',
        241.60,
        'Compra de Manuales de Siervas (12 unid.)',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '441'
        ),
        'egreso',
        934.20,
        'Comprar de manuales de Siervas (54 unid.)',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '441'
        ),
        'egreso',
        322.00,
        'Compra de manual de consejeras (10 unid.)',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '412'
        ),
        'egreso',
        155.00,
        'Gastos de Alimentacion curso siervas',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '452'
        ),
        'egreso',
        380.00,
        'fotocopia adicional',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '412'
        ),
        'egreso',
        27.00,
        'Compra de empanadas',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '412'
        ),
        'egreso',
        14.00,
        'Compra de canela',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '452'
        ),
        'egreso',
        90.00,
        'Pago material extra(fotocopias) Ptra. Felicidad',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '452'
        ),
        'egreso',
        85.00,
        'Derecho a examen - Oficina Nacional',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '452'
        ),
        'egreso',
        30.00,
        'compra de gas licuado',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '452'
        ),
        'egreso',
        89.00,
        'Compra - hdmi (10mts)',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '452'
        ),
        'egreso',
        19.00,
        'Compra de tela blanca (2 mtrs.)',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '452'
        ),
        'egreso',
        40.00,
        'Gastos de elaboracion de certificados de participacion',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '452'
        ),
        'egreso',
        345.00,
        'Compra de faldas de Siervas (9 unid.)',
        '2026-05-01',
        '1397'
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '452'
        ),
        'egreso',
        320.00,
        'Compra de falda de Siervas (8 unid.)',
        '2026-05-01',
        NULL
    ),
    (
        1,
        (
            SELECT id_cuenta
            FROM cuentas_contables
            WHERE codigo = '441'
        ),
        'egreso',
        75.00,
        'Compra de 3 manuales guias de respuestas',
        '2026-05-01',
        NULL
    );