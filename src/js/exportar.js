function exportarParaOExcel() {
    let grupos = [
        {
            name: 'Grupo A',
            from: { table: 'grupo-A' }
        },
    ]

    if ($("#grupo-B").length) {
        grupos.push({
            name: 'Grupo B',
            from: { table: 'grupo-B' }
        })
    }

    if ($("#grupo-C").length) {
        grupos.push({
            name: 'Grupo C',
            from: { table: 'grupo-C' }
        })
    }

    return ExcellentExport.convert({ anchor: document.getElementById("exportar"), filename: 'ficha-de-treino', format: 'xlsx' }, grupos)
}