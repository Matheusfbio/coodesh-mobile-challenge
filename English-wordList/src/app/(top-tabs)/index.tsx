import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Word {
  id: string;
  word: string;
  definition: string;
}

export default function WordList() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWordsFromAPI = async () => {
      try {
        // Aqui você pode definir a palavra a ser pesquisada
        const wordToSearch = "example";
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${wordToSearch}`
        );

        if (!response.ok) {
          throw new Error("Falha ao buscar dados da API");
        }

        const data = await response.json();

        // Mapeia os dados retornados para o formato esperado
        const fetchedWords: Word[] = data.map((entry: any) => ({
          id: entry.word, // Usando a palavra como ID único
          word: entry.word,
          definition:
            entry.meanings
              ?.flatMap((meaning: any) => meaning.definitions)
              ?.map((def: any) => def.definition)
              ?.join("; ") || "Definição não disponível",
        }));

        setWords(fetchedWords);
      } catch (err: any) {
        console.error("Erro ao buscar palavras:", err);
        setError(err.message || "Erro ao carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchWordsFromAPI();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando palavras...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}>Erro: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={words}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.word}>{item.word}</Text>
            <Text style={styles.definition}>{item.definition}</Text>
          </View>
        )}
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
  definition: {
    fontSize: 14,
    marginTop: 5,
  },
});
