import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Word {
  id: string;
  word: string;
  definition: string;
  phonetic: string;
  synonyms?: string[];
  example?: string;
}

export default function WordList() {
  const [searchTerm, setSearchTerm] = useState<string>(""); // Estado para o termo de busca
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWordsFromAPI = async () => {
    if (!searchTerm.trim()) return; // Impede busca vazia

    setLoading(true);
    setError(null);
    setWords([]);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`
      );

      if (!response.ok) {
        throw new Error("Essa palavra não existe");
      }

      const data = await response.json();

      const fetchedWords: Word[] = data.map((entry: any) => ({
        id: entry.word, // Usando a palavra como ID único
        word: entry.word,
        phonetic: entry.phonetic || "Pronúncia não disponível",
        definition:
          entry.meanings
            ?.flatMap((meaning: any) =>
              meaning.definitions.map((def: any) => {
                const definitionText = def.definition;
                const exampleText = def.example
                  ? `Exemplo: ${def.example}`
                  : "";
                return `${definitionText}\n${exampleText}`;
              })
            )
            ?.join("\n") || "Definição não disponível",
        synonyms: entry.meanings?.flatMap((meaning: any) => meaning.synonyms),
      }));

      setWords(fetchedWords);
    } catch (err: any) {
      console.error("Erro ao buscar palavras:", err);
      setError(err.message || "Erro ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Campo de Pesquisa */}
      <TextInput
        style={styles.input}
        placeholder="Digite uma palavra"
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={fetchWordsFromAPI} // Permite buscar ao pressionar Enter
      />

      {/* Botão de Buscar */}
      <TouchableOpacity style={styles.button} onPress={fetchWordsFromAPI}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      {/* Loading */}
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Carregando palavras...</Text>
        </View>
      )}

      {/* Erro */}
      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}

      {/* Lista de Resultados */}
      <FlatList
        data={words}
        keyExtractor={(item, index) => `${item.id}-${index}`} // Combina id e índice
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.word}>{item.word}</Text>
            <Text style={styles.phonetic}>{item.phonetic}</Text>
            <Text style={styles.definition}>{item.definition}</Text>
            {item.synonyms && item.synonyms.length > 0 && (
              <Text style={styles.synonyms}>
                Sinônimos: {item.synonyms.join(", ")}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          !loading && !error && words.length === 0 ? (
            <Text style={styles.emptyMessage}>Nenhuma palavra encontrada.</Text>
          ) : null // Retorna null em vez de false
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loading: {
    alignItems: "center",
    marginVertical: 10,
  },
  item: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  word: {
    fontSize: 18,
    fontWeight: "bold",
  },
  phonetic: {
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 5,
  },
  definition: {
    fontSize: 14,
    marginTop: 5,
  },
  synonyms: {
    fontSize: 14,
    marginTop: 5,
    color: "#555",
  },
  emptyMessage: {
    marginTop: 20,
    textAlign: "center",
    color: "#aaa",
  },
});
