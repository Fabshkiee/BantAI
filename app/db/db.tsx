import SQLite from "react-native-sqlite-storage";

const db = SQLite.openDatabase({
  name: "app.db",
  location: "default",
});

export type HazardData = {
  id: number;
  title: string;
  variant: "low" | "medium" | "high" | "critical";
  reason: string;
  suggestedFix: string;
};

export async function fetchDataFromDB(): Promise<HazardData[]> {
  return new Promise(async (resolve, reject) => {
    const conn = await db;
    conn.transaction((tx: any) => {
      tx.executeSql(
        "SELECT id, name, category, default_severity, description, recommendation FROM hazard_types",
        [],
        (tx: any, results: any) => {
          let len = results.rows.length;
          let data: any[] = [];

          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            data.push({
              id: row.id,
              title: row.name,
              variant: row.default_severity,
              reason: row.description,
              suggestedFix: row.recommendation,
            });
          }
          resolve(data);
        },
        (tx: any, error: any) => {
          reject(error);
        },
      );
    });
  });
}
