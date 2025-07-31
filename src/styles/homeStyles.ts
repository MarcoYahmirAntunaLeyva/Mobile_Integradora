import { Dimensions, StyleSheet } from "react-native";
import { Card } from "react-native-paper";

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: 20,
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
  topImage: {
    width: "100%",
    height: 220,
    borderColor: "#000000",
    borderStyle: "solid",
  },
  phContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
  },
  phLabel: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  phPercent: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000ff",
  },
  card: {
    margin: 10,
    padding: 0,
    borderRadius: 8,
  },
  progressBar: {
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    padding:15,
    backgroundColor: "#4fa2d6ff",
    borderRadius: 5,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    flexWrap: 'wrap',
  },
  metricBox: {
    backgroundColor: "#6AA558",
    borderRadius: 15,
    padding: 15,
    width: width * 0.45,
    marginBottom: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  metricLabel: {
    fontSize: 16,
    color: "#fff",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  tableContainer: {
    marginHorizontal: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#6AA558',
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
});
export default styles;