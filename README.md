# The Met Open Access Analytics Dashboard

## Overview & Tech Stack
This project is a full-stack data analytics pipeline and visualization dashboard built around the Metropolitan Museum of Art's Open Access dataset. It demonstrates the end-to-end process of extracting a massive (300MB+, 500,000+ row) raw dataset, ingesting it into a relational database, exposing it via a custom REST API, and rendering the insights on an interactive client interface. 

**Core Technologies:**
*   **Database:** PostgreSQL (containerized via Docker)
*   **Backend:** Node.js, Express, `pg` (PostgreSQL client)
*   **Frontend:** React (scaffolded with Vite), Recharts for data visualization
*   **Data Source:** [The Met Museum Open Access CSV](https://github.com/metmuseum/openaccess)

## Data Architecture
To handle real-world, messy data at scale, this project mimics an ELT (Extract, Load, Transform) pipeline. Because source control is for code and not data, the massive `.csv` file is intentionally omitted from this repository via `.gitignore`. 

Instead of reading a flat file into memory, the raw CSV is bulk-loaded (`\copy`) into a PostgreSQL instance where every column is initially staged as `TEXT` to prevent ingestion crashes from inconsistent data types (e.g., dates recorded as "ca. 1850"). The Node.js backend then queries this database directly, aggregating and formatting the data before serving it as JSON to the React frontend.

## Local Setup Instructions

**1. Clone the Repository & Get the Data**
```bash
git clone [https://github.com/your-username/museum-analytics.git](https://github.com/your-username/museum-analytics.git)
cd museum-analytics
```

* Navigate to The Met's GitHub Repository.
* Important: Because this is hosted via Git LFS, do not right-click and "Save As". Click the Download Raw File icon at the top right of the file preview.
* Place the downloaded MetObjects.csv in the root folder of this repository.

**2. Initialize the Database**
Spin up a local PostgreSQL Docker container and copy the dataset inside it:

``` bash
docker run --name met-db -e POSTGRES_PASSWORD=admin -p 5432:5432 -d postgres
docker cp MetObjects.csv met-db:/MetObjects.csv
```
Access the interactive terminal to create the database and table schema:

```bash
docker exec -it met-db psql -U postgres
```

```sql
CREATE DATABASE museum;
\c museum

CREATE TABLE raw_met_objects (
    object_number TEXT, is_highlight TEXT, is_timeline_work TEXT, is_public_domain TEXT,
    object_id TEXT, gallery_number TEXT, department TEXT, accession_year TEXT,
    object_name TEXT, title TEXT, culture TEXT, period TEXT, dynasty TEXT,
    reign TEXT, portfolio TEXT, constituent_id TEXT, artist_role TEXT,
    artist_prefix TEXT, artist_display_name TEXT, artist_display_bio TEXT,
    artist_suffix TEXT, artist_alpha_sort TEXT, artist_nationality TEXT,
    artist_begin_date TEXT, artist_end_date TEXT, artist_gender TEXT,
    artist_ulan_url TEXT, artist_wikidata_url TEXT, object_date TEXT,
    object_begin_date TEXT, object_end_date TEXT, medium TEXT,
    dimensions TEXT, credit_line TEXT, geography_type TEXT, city TEXT,
    state TEXT, county TEXT, country TEXT, region TEXT, subregion TEXT,
    locale TEXT, locus TEXT, excavation TEXT, river TEXT, classification TEXT,
    rights_and_reproduction TEXT, link_resource TEXT, object_wikidata_url TEXT,
    metadata_date TEXT, repository TEXT, tags TEXT, tags_aat_url TEXT,
    tags_wikidata_url TEXT
);

\copy raw_met_objects FROM '/MetObjects.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
```

**3. Start the Backend API**

Open a new terminal window:

```bash
cd backend
npm install
node server.js
```

The API will run on http://localhost:3000.

**4. Start the Frontend Dashboard**

Open another terminal window:   

```bash
cd frontend
npm install
npm run dev
```
The React application will be accessible at http://localhost:5173.

**Future Roadmap**

*   **Data Cleaning (SQL Transformation):** Write a SQL script to normalize TEXT fields (e.g., standardizing text-based dates into native SQL DATE types, and casting IDs to INTEGER).

*   **Extended API Endpoints:** Add parameterized routes to allow filtering by artist, century, or culture.

*   **Dashboard Expansion:** Introduce interactive timeline components and donut charts to visualize Public Domain status and chronological acquisition histories.