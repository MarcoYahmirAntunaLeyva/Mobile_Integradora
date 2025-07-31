import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#F8F9FA",
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginTop: -10,
    marginLeft: -20,
    marginRight: -20,
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  header: {
    backgroundColor: "#22C55E",
    paddingVertical: 10,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
    roleBadge: {
    backgroundColor: "#FFD600",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  roleText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 12,
  },
    profileHeader: {
    paddingTop: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  avatar: {
    marginTop: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
    marginTop: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center"
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,

    color: "#333",
  },
  inputGroup: {
    marginBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 14,
    color: "#333",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#888",
  },
  saveButton: {
    backgroundColor: "#2ECC71",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
export default styles;