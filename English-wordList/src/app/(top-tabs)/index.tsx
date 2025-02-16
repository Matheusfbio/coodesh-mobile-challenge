import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../../firebaseConfig";
import { ref, set, onValue, push } from "firebase/database";

interface Word {
  id: string;
  word: string;
  definition: string;
  phonetic: string;
  synonyms?: string[];
  example?: string;
}

const words: string[] = [
  "apple",
  "ant",
  "astronaut",
  "avocado",
  "argument",
  "art",
  "alarm",
  "address",
  "adventure",
  "adopt",
  "banana",
  "boat",
  "breeze",
  "book",
  "bird",
  "ball",
  "butterfly",
  "bicycle",
  "brick",
  "bloom",
  "car",
  "cat",
  "cloud",
  "cup",
  "calendar",
  "chocolate",
  "crayon",
  "camera",
  "castle",
  "candle",
  "dog",
  "dance",
  "dream",
  "door",
  "desk",
  "dinosaur",
  "dolphin",
  "doctor",
  "drum",
  "dragon",
  "elephant",
  "energy",
  "echo",
  "engine",
  "egg",
  "earth",
  "envelope",
  "education",
  "electricity",
  "experiment",
  "fish",
  "flower",
  "forest",
  "fan",
  "flag",
  "freedom",
  "friend",
  "fountain",
  "football",
  "feather",
  "grape",
  "guitar",
  "gold",
  "game",
  "giraffe",
  "glass",
  "garden",
  "glove",
  "group",
  "goal",
  "house",
  "happy",
  "hero",
  "hat",
  "hammer",
  "honey",
  "hippopotamus",
  "horizon",
  "heart",
  "history",
  "ice",
  "idea",
  "island",
  "illustration",
  "insect",
  "internet",
  "injury",
  "impact",
  "information",
  "intelligence",
  "jungle",
  "jump",
  "joy",
  "jacket",
  "jelly",
  "journey",
  "joke",
  "jog",
  "jewel",
  "juice",
  "kangaroo",
  "kite",
  "king",
  "key",
  "kitchen",
  "kiwi",
  "knight",
  "knowledge",
  "kingdom",
  "kettle",
  "lemon",
  "lamp",
  "laughter",
  "lake",
  "lawn",
  "light",
  "lunch",
  "leap",
  "lion",
  "language",
  "moon",
  "mountain",
  "magic",
  "mirror",
  "money",
  "magnet",
  "mango",
  "mountain",
  "mouse",
  "music",
  "night",
  "nature",
  "nest",
  "nose",
  "note",
  "needle",
  "nurse",
  "net",
  "nut",
  "neighbor",
  "ocean",
  "orange",
  "owl",
  "octopus",
  "office",
  "onion",
  "oasis",
  "orange",
  "outfit",
  "oxygen",
  "pencil",
  "planet",
  "peace",
  "paper",
  "penguin",
  "piano",
  "plumber",
  "parrot",
  "picture",
  "pool",
  "queen",
  "quiet",
  "quilt",
  "quarry",
  "question",
  "quick",
  "quiz",
  "quality",
  "quarter",
  "quota",
  "rainbow",
  "river",
  "rose",
  "rock",
  "robot",
  "rabbit",
  "roof",
  "race",
  "rug",
  "rain",
  "sun",
  "star",
  "snow",
  "sock",
  "sand",
  "snake",
  "school",
  "strawberry",
  "soup",
  "storm",
  "tree",
  "tiger",
  "travel",
  "table",
  "turtle",
  "train",
  "tooth",
  "television",
  "trophy",
  "telescope",
  "umbrella",
  "unicorn",
  "unity",
  "under",
  "uniform",
  "universe",
  "usual",
  "up",
  "urgent",
  "unaware",
  "violin",
  "volcano",
  "victory",
  "vase",
  "vampire",
  "village",
  "vision",
  "vacuum",
  "vulture",
  "vote",
  "water",
  "whale",
  "wonder",
  "wind",
  "waltz",
  "whistle",
  "world",
  "wood",
  "wallet",
  "wall",
  "xylophone",
  "x-ray",
  "xerox",
  "xenon",
  "xmas",
  "x-factor",
  "xenophobia",
  "xylophonist",
  "xenial",
  "xenopus",
  "yellow",
  "yoga",
  "youth",
  "yawn",
  "yoga",
  "yacht",
  "yolk",
  "yummy",
  "yarn",
  "year",
  "zebra",
  "zipper",
  "zoom",
  "zero",
  "zombie",
  "zone",
  "zinc",
  "zodiac",
  "zoo",
  "zeal",
];

export default function WordList() {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const historyRef = ref(db, "history");
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setHistory(Object.values(data) as string[]);
      } else {
        setHistory([]);
      }
    });
  }, []);

  const fetchWordDetails = async (word: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

      if (!response.ok) {
        throw new Error("Essa palavra não existe");
      }

      const data = await response.json();

      const fetchedWord: Word = {
        id: data[0].word,
        word: data[0].word,
        phonetic: data[0].phonetic || "Pronúncia não disponível",
        definition:
          data[0].meanings
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
        synonyms: data[0].meanings?.flatMap((meaning: any) => meaning.synonyms),
      };

      await set(ref(db, `words/${fetchedWord.word}`), data);
      console.log("Dados enviados com sucesso para o Firebase!");

      await push(ref(db, "history"), fetchedWord.word);

      setSelectedWord(fetchedWord);
      setModalVisible(true);
    } catch (err: any) {
      console.error("Erro ao buscar palavra:", err);
      setError(err.message || "Erro ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (word: Word) => {
    try {
      await set(ref(db, `favorites/${word.word}`), word);
      Alert.alert("Palavra adicionada aos favoritos!");
    } catch (error) {
      Alert.alert(`Erro ao adicionar aos favoritos: ${error}`);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedWord(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word List</Text>

      <ScrollView style={styles.wordList}>
        <View style={styles.wordRow}>
          {words.map((word, index) => (
            <TouchableOpacity
              key={index}
              style={styles.wordButton}
              onPress={() => fetchWordDetails(word)}
            >
              <Text style={styles.wordText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {loading && <ActivityIndicator size="large" />}

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <ScrollView style={styles.wordDetails}>
          <SafeAreaView style={styles.Highlight}>
            <Text style={styles.wordTitle}>{selectedWord?.word}</Text>
            <Text style={styles.phonetic}>{selectedWord?.phonetic}</Text>
          </SafeAreaView>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => addToFavorites(selectedWord!)}
          >
            <Text style={styles.favoriteButtonText}>
              Adicionar aos Favoritos
            </Text>
          </TouchableOpacity>
          <Text style={styles.definition}>{selectedWord?.definition}</Text>
          {selectedWord?.synonyms && (
            <Text style={styles.synonyms}>
              Sinônimos: {selectedWord.synonyms.join(", ")}
            </Text>
          )}
        </ScrollView>
      </Modal>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  wordList: {
    marginTop: 10,
  },
  wordRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  wordButton: {
    margin: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  wordText: {
    fontSize: 16,
  },
  wordDetails: {
    marginTop: 10,
    padding: 10,
  },
  Highlight: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },

  wordTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },

  phonetic: {
    fontSize: 18,
    justifyContent: "center",
    color: "#333",
    marginVertical: 10,
    fontStyle: "italic",
  },
  definition: {
    fontSize: 16,
    marginVertical: 5,
  },
  synonyms: {
    fontSize: 16,
    marginVertical: 5,
    color: "#888",
  },
  closeButton: {
    width: 40,
    margin: 10,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  favoriteButton: {
    backgroundColor: "gold",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
