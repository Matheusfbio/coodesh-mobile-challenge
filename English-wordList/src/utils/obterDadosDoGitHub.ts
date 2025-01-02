async function obterDadosDoGitHub() {
  try {
    const resposta = await fetch(
      "https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json"
    );
    if (!resposta.ok) {
      throw new Error(`Erro ao obter dados: ${resposta.status}`);
    }
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro ao obter dados do GitHub:", erro);
    return null;
  }
}
