document.addEventListener('scroll', function () {
    const buscarPorcentagemTela = () => {
        return (document.documentElement["scrollTop"] || document.body["scrollTop"]) / ((document.documentElement["scrollHeight"] || document.body["scrollHeight"]) - document.documentElement.clientHeight) * 100
    }

    document.querySelector('.progress-bar').style.setProperty('--scroll', buscarPorcentagemTela() + '%')
})