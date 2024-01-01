import Exercicios from './exercicios.js'

$(document).ready(function () {
    const continuar = $("#continuar")

    $(".opcao").each(function (i, opcao) {
        $(opcao).click(function () {
            const listaDeOpcoes = $(this).parent()
            const multiplo = $(this).parent().attr("multiple") ? true : false

            if (!multiplo) {
                $(listaDeOpcoes).children().each(function (i, opcoes) {
                    $(opcoes).removeClass("selecionado")
                })
            }

            if (multiplo)
                $(opcao).toggleClass("selecionado")
            else
                $(opcao).addClass("selecionado")

            habilitarDesabilitarBotao()
        })
    })

    $("#altura").change(function () {
        habilitarDesabilitarBotao()
    })

    $('#altura').mask('999')
    $('#peso').mask('999')

    $("#peso").change(function () {
        habilitarDesabilitarBotao()
    })

    $("#nome").change(function () {
        habilitarDesabilitarBotao()
    })

    function habilitarDesabilitarBotao() {
        let temIdade = false

        if ($(`#p1`).find(".selecionado")) {
            const valor = $($(`#p1`).find(".selecionado")).attr("data-valor")

            if (valor) temIdade = true
        }

        let temObjetivo = false

        if ($(`#p2`).find(".selecionado")) {
            const valor = $($(`#p2`).find(".selecionado")).attr("data-valor")

            if (valor) temObjetivo = true
        }

        let temTipoDeCorpo = false

        if ($(`#p3`).find(".selecionado")) {
            const valor = $($(`#p3`).find(".selecionado")).attr("data-valor")

            if (valor) temTipoDeCorpo = true
        }

        let temCorpoDeseja = false

        if ($(`#p4`).find(".selecionado")) {
            const valor = $($(`#p4`).find(".selecionado")).attr("data-valor")

            if (valor) temCorpoDeseja = true
        }

        let temAreaDeCorpo = false

        if ($(`#p5`).find(".selecionado")) {
            temAreaDeCorpo = $($(`#p5`).find(".selecionado")).length != 0
        }

        const temAltura = $("#altura").val() ? true : false
        const temPeso = $("#peso").val() ? true : false
        const nome = $("#nome").val() ? true : false

        const habilitarBotao = temAltura && temPeso && nome && temIdade && temObjetivo && temTipoDeCorpo && temCorpoDeseja && temAreaDeCorpo

        if (habilitarBotao)
            $(continuar).removeAttr("disabled")
        else
            $(continuar).attr("disabled", true)
    }

    $(continuar).click(function () {
        carregamento()
    })

    function carregamento() {
        $("#formulario").hide()
        $("#resultado").hide()
        $("#loading").css("display", "flex")

        setTimeout(() => {
            $("#loading").css("display", "none")
            $("#resultado").show()
            gerarFichaDeTreino()
        }, 3000)
    }

    function gerarFichaDeTreino() {
        const peso = $("#peso").val()
        const altura = $("#altura").val()
        const nome = $("#nome").val()
        const idade = $($(`#p1`).find(".selecionado")).attr("data-valor")
        const objetivo = $($(`#p2`).find(".selecionado")).attr("data-valor")
        const tipoDeCorpo = $($(`#p3`).find(".selecionado")).attr("data-valor")
        const areasDoCorpo = []

        $($(`#p5`).find(".selecionado")).each(function (i, x) {
            areasDoCorpo.push($(x).attr("data-valor"))
        })

        let buscarExercicios = Exercicios[idade][objetivo][tipoDeCorpo]

        buscarExercicios = buscarExercicios.filter(c => {
            return c.musculosAlvo.some(x => areasDoCorpo.includes(x))
        })

        $("#ficha-treino").html("")

        $("#pronto").text(`Pronto ${nome}! Aqui está sua ficha de treino`)

        criarTabelas(buscarExercicios)

        calcularIMC(altura, peso)
    }

    function criarTabelas(exercicios) {
        const exerciciosAgrupados = agruparPorMusculo(exercicios)

        let grupos = ["A", "B", "C"]
        let i = 0

        for (const musculo in exerciciosAgrupados) {
            if (exerciciosAgrupados.hasOwnProperty(musculo)) {
                if (exerciciosAgrupados[musculo] && exerciciosAgrupados[musculo].length) {
                    $("#ficha-treino").append(`<h4>Grupo ${grupos[i]}</h4>`)
                    $("#ficha-treino").append(criarTabela(exerciciosAgrupados[musculo], grupos[i]))
                    i++
                }
            }
        }
    }

    function criarTabela(exercicios, grupo) {
        const tabela = document.createElement('table')

        tabela.id = `grupo-${grupo}`
        tabela.setAttribute("data-excel-name", `Grupo ${grupo}`)

        const colGroup = document.createElement("colgroup")
        const headerRow = tabela.insertRow()
        const headers = ['Exercício', 'Repetições', 'Descanso']

        const colWidths = ["50%", "25%", "25%"];

        colWidths.forEach((width) => {
            const col = document.createElement("col")

            col.style.width = width

            colGroup.appendChild(col)
        })

        tabela.appendChild(colGroup)

        headers.forEach(texto => {
            const th = document.createElement('th')
            const text = document.createTextNode(texto)
            th.appendChild(text)
            headerRow.appendChild(th)
        })

        exercicios.forEach(exercicio => {
            const row = tabela.insertRow()
            const exerciseNameCell = row.insertCell(0)
            const repetitionsCell = row.insertCell(1)
            const restCell = row.insertCell(2)

            exerciseNameCell.textContent = exercicio.nome
            repetitionsCell.textContent = exercicio.repeticoes
            restCell.textContent = exercicio.intervalo
        })

        return tabela
    }

    function agruparPorMusculo(exercicios) {
        const gruposDeMusculos = [
            ["Peitoral", "Braço"],
            ["Costas", "Pernas"],
            ["Ombros", "Glúteos", "Abdômen"],
        ]

        let gruposDeExercicios = {
            grupo1: [],
            grupo2: [],
            grupo3: [],
        }

        exercicios.forEach((exercicio, index) => {
            const musculosAlvo = exercicio.musculosAlvo;
            let grupoAtual;

            gruposDeMusculos.forEach((grupo, i) => {
                if (musculosAlvo.some((musculo) => grupo.includes(musculo))) {
                    grupoAtual = `grupo${i + 1}`;
                }
            });

            gruposDeExercicios[grupoAtual].push(exercicio);
        })

        return gruposDeExercicios
    }

    function calcularIMC(altura, peso) {
        let mensagem = ""

        altura = Number.parseFloat(altura) / 100

        let imc = Number.parseFloat(peso) / (altura * altura)

        imc = imc.toFixed(2)

        if (imc < 20)
            mensagem = "Baixo Peso"
        else if (imc > 20 && imc <= 25)
            mensagem = "Peso Normal"
        else if (imc > 25 && imc <= 30)
            mensagem = "Excesso de Peso"
        else if (imc > 30 && imc <= 35)
            mensagem = "Obesidade"
        else
            mensagem = "Obesidade Extrema!"

        $("#imc").text(`IMC: ${mensagem}`)

        am5.ready(function () {
            let root = am5.Root.new("chartdiv")

            root.setThemes([
                am5themes_Animated.new(root)
            ])

            let chart = root.container.children.push(
                am5radar.RadarChart.new(root, {
                    panX: false,
                    panY: false,
                    startAngle: 180,
                    endAngle: 360
                })
            )

            let axisRenderer = am5radar.AxisRendererCircular.new(root, {
                innerRadius: -10,
                strokeOpacity: 1,
                strokeWidth: 15,
                strokeGradient: am5.LinearGradient.new(root, {
                    rotation: 0,
                    stops: [
                        { color: am5.color("#75a5c9") },
                        { color: am5.color("#77a67c") },
                        { color: am5.color("#e3c651") },
                        { color: am5.color("#c2741f") },
                        { color: am5.color("#c22339") }
                    ]
                })
            })

            root.interfaceColors.set("text", am5.color("#ffffff"))

            let xAxis = chart.xAxes.push(
                am5xy.ValueAxis.new(root, {
                    maxDeviation: 0,
                    min: 18.5,
                    max: 35,
                    strictMinMax: true,
                    renderer: axisRenderer
                })
            )

            let axisDataItem = xAxis.makeDataItem({})
            axisDataItem.set("value", 0)

            axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
                sprite: am5radar.ClockHand.new(root, {
                    radius: am5.percent(99)
                })
            }))

            xAxis.createAxisRange(axisDataItem)

            axisDataItem.get("grid").set("visible", false)

            axisDataItem.animate({
                key: "value",
                to: parseInt(imc),
                duration: 800,
                easing: am5.ease.out(am5.ease.cubic)
            })

            chart.appear(1000, 100)
        })
    }
})