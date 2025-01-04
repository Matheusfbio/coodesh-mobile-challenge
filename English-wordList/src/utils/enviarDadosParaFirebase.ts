import firebase from "firebase/app";
import "firebase/firestore"; // Importe o Firestore

// Sua configuração do Firebase (obtida no console do Firebase)
const firebaseConfig = {
  // ... suas configurações
};

// Inicialize o Firebase se ainda não foi inicializado
if (!firebase.getApps().length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

async function enviarDadosParaFirebase(dados: any) {
  if (!dados) return;

  try {
    // Você pode usar um loop para adicionar os dados em lotes se forem muitos dados.
    // Isso é mais eficiente do que enviar muitos documentos individualmente.
    const batch = db.batch();

    for (const palavra in dados) {
      const docRef = db.collection("palavras").doc(palavra); // Use a palavra como ID do documento
      batch.set(docRef, { definicao: dados[palavra] });
    }

    await batch.commit();

    console.log("Dados enviados para o Firebase com sucesso!");
  } catch (erro) {
    console.error("Erro ao enviar dados para o Firebase:", erro);
  }
}

// Chame as funções
async function importarDados() {
  const dados = await obterDadosDoGitHub();
  await enviarDadosParaFirebase(dados);
}

importDados();
