import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const CLOUD_NAME = "dxfdy9lxc";
const UPLOAD_PRESET = "storage_facul";

// Substitua pelo endereço do seu backend Node.js
const BACKEND_URL = "http://10.31.88.99:3001"; // ou IP local da sua máquina

export default function Index() {
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos da sua permissão para acessar a galeria."
        );
      } else {
        loadImages();
      }
    })();
  }, []);

  const loadImages = async () => {
    setLoadingImages(true);
    try {
      const res = await fetch(`${BACKEND_URL}/images`);
      const data = await res.json();
      setImages(data);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar imagens");
    } finally {
      setLoadingImages(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadToCloudinary(result.assets[0]);
    }
  };

  const uploadToCloudinary = async (photo: any) => {
    setUploading(true);
    const data: any = new FormData();
    data.append("upload_preset", UPLOAD_PRESET);

    if (Platform.OS === "web") {
      data.append("file", photo.file);
    } else {
      data.append("file", {
        uri: photo.uri,
        type: photo.type ?? "image/jpeg",
        name: photo.fileName ?? "upload.jpg",
      } as any);
    }

    data.append("tags", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const result = await res.json();
      if (result.secure_url) {
        setImages((prev: any) => [result, ...prev]);
      } else {
        Alert.alert("Erro no upload", "Falha ao enviar imagem para Cloudinary");
      }
    } catch (error: any) {
      Alert.alert(
        "Erro no upload",

        error.message
      );
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = (public_id: any) => {
    Alert.alert("Deletar imagem", "Deseja realmente remover esta imagem?", [
      {
        text: "Cancelar",

        style: "cancel",
      },

      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${BACKEND_URL}/delete-image`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ public_id }),
            });
            const json = await res.json();

            if (json.result === "ok") {
              setImages((prev) =>
                prev.filter((img: any) => img.public_id !== public_id)
              );
              Alert.alert("Sucesso", "Imagem deletada");
            } else {
              Alert.alert("Erro", "Falha ao deletar imagem");
            }
          } catch (error: any) {
            Alert.alert(
              "Erro",

              error.message
            );
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.secure_url }} style={styles.image} />
      <TouchableOpacity
        onPress={() => deleteImage(item.public_id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Deletar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Galeria</Text>
      <Button title="Selecionar imagem" onPress={pickImage} />
      {uploading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 10 }}
        />
      )}
      {loadingImages ? (
        <ActivityIndicator
          size="large"
          color="green"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item: any) => item.public_id}
          renderItem={renderItem}
          contentContainerStyle={{ marginTop: 20 }}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  image: { width: 120, height: 120, borderRadius: 8 },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteText: { color: "#fff", fontWeight: "bold" },
});
