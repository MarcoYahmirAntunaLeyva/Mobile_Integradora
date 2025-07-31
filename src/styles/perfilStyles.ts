import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#22C55E",
    paddingVertical: 16,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 1.2,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    paddingTop: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  avatar: {
    marginTop: 20 ,
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
  email: {
    fontSize: 14,
    color: "#ffffff",
    marginBottom: 10,
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
  infoSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  infoGroup: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: "#444",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    padding: 12,
    fontWeight: "bold"
  },
  editButton: {
    backgroundColor: "#2ECC71",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  editText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",

  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default styles;
