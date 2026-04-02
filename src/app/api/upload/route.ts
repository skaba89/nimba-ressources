import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

interface CsvProject {
  name: string;
  sector: string;
  budget: number;
  cost: number;
  revenue: number;
  roi: number;
  status: string;
  country: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { success: false, message: "Seuls les fichiers CSV sont acceptés" },
        { status: 400 }
      );
    }

    const text = await file.text();

    const result = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase(),
    });

    if (result.errors.length > 0 && result.data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Erreur de parsing CSV: ${result.errors[0].message}`,
        },
        { status: 400 }
      );
    }

    const requiredColumns = ["name", "sector", "budget", "cost", "revenue", "roi", "status", "country"];
    const headers = Object.keys(result.data[0] || {});

    const missingColumns = requiredColumns.filter((col) => !headers.includes(col));

    if (missingColumns.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Colonnes manquantes: ${missingColumns.join(", ")}. Colonnes requises: ${requiredColumns.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const projects: CsvProject[] = result.data
      .map((row) => ({
        name: String(row.name || "").trim(),
        sector: String(row.sector || "").trim(),
        budget: parseFloat(row.budget) || 0,
        cost: parseFloat(row.cost) || 0,
        revenue: parseFloat(row.revenue) || 0,
        roi: parseFloat(row.roi) || 0,
        status: String(row.status || "Active").trim(),
        country: String(row.country || "").trim(),
      }))
      .filter((p) => p.name.length > 0);

    return NextResponse.json({
      success: true,
      message: `${projects.length} projets importés avec succès`,
      projects,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Erreur serveur lors du traitement du fichier" },
      { status: 500 }
    );
  }
}
