const fs = require('fs')
const Excel = require('exceljs')

exports.kehadiran = (Grup) => new Promise((resolve, reject) => {
    let array = JSON.parse(fs.readFileSync('./lib/json/absensi.json'))
    if (array[Grup] === undefined || array[Grup].judulabsen === undefined || array[Grup].jumlahsiswa === undefined || array[Grup].absensi === undefined) return resolve("List absen belum dibuat")
    let absen = array[Grup].judulabsen
    for (let i = 0; i < array[Grup].jumlahsiswa; i++) {
        const noabsen = i + 1
        const abtda = array[Grup].absensi.map((e) => {
            return e.absen
        }).indexOf(`${noabsen}`);
        for (let a = 0; a < array[Grup].absensi.length; a++) {
            if (array[Grup].absensi[a].absen == noabsen) {
                absen += `\n${noabsen}. ${array[Grup].absensi[a].nama}${array[Grup].absensi[a].pesan}`
            }
        }
        if (abtda === -1) {
            absen += `\n${noabsen}.`
        }
    }
    resolve(absen)
})

exports.excel = (Grup) => new Promise((resolve, reject) => {
    let array = JSON.parse(fs.readFileSync('./lib/json/absensi.json'))
    if (array[Grup] === undefined || array[Grup].judulabsen === undefined || array[Grup].jumlahsiswa === undefined || array[Grup].absensi === undefined) return resolve("List absen belum dibuat")
    let data = []
    for (let i = 0; i < array[Grup].jumlahsiswa; i++) {
        const noabsen = i + 1
        const abtda = array[Grup].absensi.map((e) => {
            return e.absen
        }).indexOf(`${noabsen}`);
        for (let a = 0; a < array[Grup].absensi.length; a++) {
            if (array[Grup].absensi[a].absen == noabsen) {
                data.push({
                    "absen": noabsen,
                    "nama": array[Grup].absensi[a].nama,
                    "pesan": array[Grup].absensi[a].pesan,
                    "waktu": array[Grup].absensi[a].waktu
                })
            }
        }
        if (abtda === -1) {
            data.push({
                "absen": noabsen
            })
        }
    }

    let workbook = new Excel.Workbook()
    let worksheet = workbook.addWorksheet('Absensi')

    worksheet.columns = [{
            header: 'No',
            key: 'absen',
            width: 3
        },
        {
            header: 'Nama',
            key: 'nama'
        },
        {
            header: 'Pesan',
            key: 'pesan'
        },
        {
            header: 'Waktu',
            key: 'waktu'
        }
    ]

    worksheet.columns.forEach(function (column, i) {
        if (i !== 0) {
            var maxLength = 0;
            column["eachCell"]({
                includeEmpty: true
            }, function (cell) {
                var columnLength = cell.value ? cell.value.toString().length : 30;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });
            column.width = maxLength < 30 ? 30 : maxLength;
        }
    });

    worksheet.autoFilter = 'A1:D1';

    worksheet.getRow(1).font = {
        bold: true
    }

    data.forEach((e, index) => {
        const rowIndex = index + 2

        worksheet.addRow({
            ...e,
            amountRemaining: {
                formula: `=C${rowIndex}-D${rowIndex}`
            },
            percentRemaining: {
                formula: `=E${rowIndex}/C${rowIndex}`
            }
        })
    })

    const figureColumns = [3, 4, 5, 6]
    figureColumns.forEach((i) => {
        worksheet.getColumn(i).numFmt = '$0.00'
        worksheet.getColumn(i).alignment = {
            horizontal: 'center'
        }
    })

    worksheet.getColumn(6).numFmt = '0.00%'

    worksheet.eachRow({
        includeEmpty: false
    }, function (row, rowNumber) {
        worksheet.getCell(`A${rowNumber}`).border = {
            top: {
                style: 'thin'
            },
            left: {
                style: 'thin'
            },
            bottom: {
                style: 'thin'
            },
            right: {
                style: 'none'
            }
        }

        const insideColumns = ['B', 'C']
        insideColumns.forEach((v) => {
            worksheet.getCell(`${v}${rowNumber}`).border = {
                top: {
                    style: 'thin'
                },
                bottom: {
                    style: 'thin'
                },
                left: {
                    style: 'none'
                },
                right: {
                    style: 'none'
                }
            }
        })

        worksheet.getCell(`D${rowNumber}`).border = {
            top: {
                style: 'thin'
            },
            left: {
                style: 'none'
            },
            bottom: {
                style: 'thin'
            },
            right: {
                style: 'thin'
            }
        }
    })

    const dirm = "./media"
    if (!fs.existsSync(dirm)) {
        fs.mkdirSync(dirm);
    }
    workbook.xlsx.writeFile(`${dirm}/absensi.xlsx`).then(() => {
        resolve(`${dirm}/absensi.xlsx`)
    }).catch((err) => {
        console.log(err)
    })
})