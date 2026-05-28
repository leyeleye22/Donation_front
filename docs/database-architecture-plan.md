# Plan d'Architecture Base de Données — Entraide Humanitaire CMS

**Auteur:** Ingénieur Backend Google (16 ans exp.)  
**Cible:** PostgreSQL 16+ / Laravel 12+  
**Références:** spatie/laravel-translatable, polymorphic relationships, soft deletes, UUIDv7

---

## 1. Choix d'Architecture

| Décision | Choix | Justification |
|----------|-------|---------------|
| **SGBD** | PostgreSQL 16+ | JSONB natif, GIN indexes, full-text search, CTE recursion |
| **Clés primaires** | UUIDv7 (`gen_random_uuid()`) | Ordonnés temporellement, sûrs pour API publique, pas d'incrémentation exposée |
| **Localisation** | JSONB columns (spatie/laravel-translatable) | Une colonne par champ traduit, pas de tables de traduction séparées. FR/EN/AR |
| **Soft deletes** | Toutes les tables contentaires | `deleted_at` + `deleted_by` pour audit |
| **Timestamps** | `created_at`, `updated_at` (Laravel auto) + `published_at` |
| **Versioning** | Table `content_versions` polymorphique | Snapshots JSON avant chaque mise à jour |

---

## 2. Schéma Relationnel (Mermaid)

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email UK
        string password_hash
        string name
        string role "admin|editor|viewer"
        boolean is_active
        timestamp last_login_at
        timestamps
    }

    SESSIONS {
        uuid id PK
        uuid user_id FK
        string token UK
        timestamp expires_at
        timestamp created_at
    }

    NAV_ITEMS {
        uuid id PK
        int sort_order
        jsonb label "LocalizedText"
        string href
        boolean is_active
        soft_deletes
        timestamps
    }

    PROJECTS {
        uuid id PK
        string slug UK
        enum theme "education|water|health|tabaski|food"
        jsonb title "LocalizedText"
        jsonb description "LocalizedText"
        jsonb location "LocalizedText"
        jsonb beneficiary_label "LocalizedText"
        bigint goal_amount
        bigint collected_amount
        enum status "upcoming|ongoing|completed"
        string cover_image
        timestamp published_at
        soft_deletes
        timestamps
    }

    POSTS {
        uuid id PK
        string slug UK
        jsonb title "LocalizedText"
        jsonb excerpt "LocalizedText"
        jsonb content "LocalizedText"
        string image
        enum category "terrain|project-update|association"
        jsonb location "LocalizedText"
        string read_time
        boolean is_published
        timestamp published_at
        soft_deletes
        timestamps
    }

    GALLERY_ITEMS {
        uuid id PK
        jsonb title "LocalizedText"
        string file_path
        enum file_type "image|video|document"
        jsonb categories
        bigint file_size
        string mime_type
        uuid uploaded_by FK
        soft_deletes
        timestamps
    }

    PAGE_CONTENT {
        uuid id PK
        string page_slug UK "home|about|contact|projects|journal|gallery"
        jsonb content "Full page content (see section 4)"
        uuid published_by FK
        timestamp published_at
        timestamps
    }

    GLOBAL_SETTINGS {
        uuid id PK "singleton row"
        string site_name
        string donation_cta_text
        boolean show_floating_button
        jsonb floating_button_pages "string[]"
        string footer_copyright
        string footer_intro
        jsonb page_visibility "Record<pageSlug, sectionVisibility>"
        jsonb page_settings "Record<pageSlug, pageHeroSettings>"
        timestamps
    }

    CONTENT_VERSIONS {
        uuid id PK
        uuid versionable_id "polymorphic"
        string versionable_type "polymorphic"
        jsonb snapshot "Full row snapshot before change"
        string action "created|updated|deleted"
        uuid performed_by FK
        timestamp created_at
    }

    MEDIA_MORPH {
        uuid media_id FK
        uuid mediable_id "polymorphic"
        string mediable_type "polymorphic"
        string role "cover|gallery|avatar|document"
    }

    USERS ||--o{ SESSIONS : has
    USERS ||--o{ GALLERY_ITEMS : uploads
    USERS ||--o{ CONTENT_VERSIONS : performs
    USERS ||--o{ PAGE_CONTENT : publishes
    GALLERY_ITEMS ||--o{ MEDIA_MORPH : "attached to"
    PROJECTS ||--o{ MEDIA_MORPH : "has media"
    POSTS ||--o{ MEDIA_MORPH : "has media"
    PAGE_CONTENT ||--o{ CONTENT_VERSIONS : versions
    PROJECTS ||--o{ CONTENT_VERSIONS : versions
    POSTS ||--o{ CONTENT_VERSIONS : versions
```

---

## 3. DDL PostgreSQL — Tables Principales

### 3.1 `users`
```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL DEFAULT 'editor'
                    CHECK (role IN ('admin','editor','viewer')),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
```

### 3.2 `sessions`
```sql
CREATE TABLE sessions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(255) NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
```

### 3.3 `nav_items`
```sql
CREATE TABLE nav_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sort_order  INTEGER NOT NULL DEFAULT 0,
    label       JSONB NOT NULL DEFAULT '{}'::jsonb,
    href        VARCHAR(255) NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    deleted_at  TIMESTAMPTZ,
    deleted_by  UUID REFERENCES users(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_nav_items_active ON nav_items(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_nav_items_order ON nav_items(sort_order);
```

### 3.4 `projects`
```sql
CREATE TYPE project_theme AS ENUM ('education','water','health','tabaski','food');
CREATE TYPE project_status AS ENUM ('upcoming','ongoing','completed');

CREATE TABLE projects (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug              VARCHAR(255) NOT NULL UNIQUE,
    theme             project_theme NOT NULL,
    title             JSONB NOT NULL DEFAULT '{}'::jsonb,
    description       JSONB NOT NULL DEFAULT '{}'::jsonb,
    location          JSONB NOT NULL DEFAULT '{}'::jsonb,
    beneficiary_label JSONB NOT NULL DEFAULT '{}'::jsonb,
    goal_amount       BIGINT NOT NULL DEFAULT 0 CHECK (goal_amount >= 0),
    collected_amount  BIGINT NOT NULL DEFAULT 0 CHECK (collected_amount >= 0),
    status            project_status NOT NULL DEFAULT 'upcoming',
    cover_image       VARCHAR(500),
    published_at      TIMESTAMPTZ,
    deleted_at        TIMESTAMPTZ,
    deleted_by        UUID REFERENCES users(id),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_status ON projects(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_theme ON projects(theme) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_slug ON projects(slug);
-- GIN index for JSONB key existence queries
CREATE INDEX idx_projects_title ON projects USING GIN (title jsonb_path_ops);
```

### 3.5 `posts`
```sql
CREATE TYPE post_category AS ENUM ('terrain','project-update','association');

CREATE TABLE posts (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug         VARCHAR(255) NOT NULL UNIQUE,
    title        JSONB NOT NULL DEFAULT '{}'::jsonb,
    excerpt      JSONB NOT NULL DEFAULT '{}'::jsonb,
    content      JSONB NOT NULL DEFAULT '{}'::jsonb,
    image        VARCHAR(500),
    category     post_category NOT NULL,
    location     JSONB NOT NULL DEFAULT '{}'::jsonb,
    read_time    VARCHAR(20) DEFAULT '5 min',
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ,
    deleted_at   TIMESTAMPTZ,
    deleted_by   UUID REFERENCES users(id),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_published ON posts(is_published, published_at DESC)
    WHERE deleted_at IS NULL AND is_published = true;
CREATE INDEX idx_posts_category ON posts(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_slug ON posts(slug);
```

### 3.6 `gallery_items`
```sql
CREATE TYPE file_type AS ENUM ('image','video','document');

CREATE TABLE gallery_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       JSONB NOT NULL DEFAULT '{}'::jsonb,
    file_path   VARCHAR(500) NOT NULL,
    file_type   file_type NOT NULL DEFAULT 'image',
    categories  JSONB NOT NULL DEFAULT '[]'::jsonb,
    file_size   BIGINT,
    mime_type   VARCHAR(127),
    uploaded_by UUID REFERENCES users(id),
    deleted_at  TIMESTAMPTZ,
    deleted_by  UUID REFERENCES users(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gallery_type ON gallery_items(file_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_gallery_categories ON gallery_items USING GIN (categories);
```

### 3.7 `page_content` (Singleton par page — Home, About, Contact)
```sql
CREATE TABLE page_content (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_slug     VARCHAR(50) NOT NULL UNIQUE
                  CHECK (page_slug IN ('home','about','contact','projects','journal','gallery')),
    content       JSONB NOT NULL DEFAULT '{}'::jsonb,
    published_by  UUID REFERENCES users(id),
    published_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.8 `global_settings` (Singleton)
```sql
CREATE TABLE global_settings (
    id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name              VARCHAR(255) NOT NULL DEFAULT 'Entraide Humanitaire',
    donation_cta_text      VARCHAR(255) NOT NULL DEFAULT 'Faire un don',
    show_floating_button   BOOLEAN NOT NULL DEFAULT true,
    floating_button_pages  JSONB NOT NULL DEFAULT '["/","/projects","/journal","/gallery","/about","/contact"]'::jsonb,
    footer_copyright       TEXT,
    footer_intro           TEXT,
    page_visibility        JSONB NOT NULL DEFAULT '{}'::jsonb,
    page_settings          JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Garantir une seule ligne
CREATE UNIQUE INDEX idx_global_settings_singleton ON global_settings((true));
```

### 3.9 `content_versions` (Versioning polymorphe)
```sql
CREATE TABLE content_versions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    versionable_id   UUID NOT NULL,
    versionable_type VARCHAR(100) NOT NULL,
    snapshot         JSONB NOT NULL,
    action           VARCHAR(20) NOT NULL CHECK (action IN ('created','updated','deleted')),
    performed_by     UUID REFERENCES users(id),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_versions_entity ON content_versions(versionable_id, versionable_type);
CREATE INDEX idx_versions_created ON content_versions(created_at DESC);
```

### 3.10 `media_morph` (Attachement polymorphe média <-> entités)
```sql
CREATE TABLE media_morph (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id       UUID NOT NULL REFERENCES gallery_items(id) ON DELETE CASCADE,
    mediable_id    UUID NOT NULL,
    mediable_type  VARCHAR(100) NOT NULL,
    role           VARCHAR(50) NOT NULL DEFAULT 'cover'
                   CHECK (role IN ('cover','gallery','avatar','document')),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_morph_media ON media_morph(media_id);
CREATE INDEX idx_media_morph_mediable ON media_morph(mediable_id, mediable_type);
CREATE UNIQUE INDEX idx_media_morph_unique_cover
    ON media_morph(mediable_id, mediable_type, role)
    WHERE role = 'cover';
```

---

## 4. Structure JSONB `content` par `page_slug`

### 4.1 `page_slug = 'home'`
```jsonc
{
  "emergencyLabel": "string",
  "emergencyText": "string",
  "heroEyebrow": "string",
  "heroTitle": "string",
  "heroDescription": "string",
  "primaryCta": "string",
  "secondaryCta": "string",
  "heroStats": [
    { "value": "string", "label": "string" }
  ],
  "trustPoints": ["string"],
  "featuredLabel": "string",
  "featuredTitle": "string",
  "featuredDescription": "string",
  "heroImage": "string (media UUID or URL)",
  "supportImage": "string",
  "proofStrip": [
    { "value": "string", "label": "string" }
  ],
  "entryPoints": [
    { "title": "string", "description": "string", "image": "string", "cta": "string", "href": "string" }
  ],
  "pillars": [
    { "title": "string", "description": "string" }
  ],
  "transparencyTitle": "string",
  "transparencyDescription": "string",
  "transparencyItems": [
    { "value": "string", "label": "string" }
  ],
  "galleryTitle": "string",
  "galleryDescription": "string",
  "donationHeading": "string",
  "donationTitle": "string",
  "donationDescription": "string",
  "donationPrimaryCta": "string",
  "donationSecondaryCta": "string",
  "newsletterTitle": "string",
  "newsletterDescription": "string"
}
```

### 4.2 `page_slug = 'about'`
```jsonc
{
  "heroEyebrow": "string",
  "heroTitle": "string",
  "heroDescription": "string",
  "stats": [{ "value": "string", "label": "string" }],
  "associationBadge": "string",
  "associationTitle": "string",
  "associationBody": ["string"],
  "associationImage": "string",
  "portrait": "string",
  "story": ["string"],
  "founderBadge": "string",
  "founderTitle": "string",
  "founderSubtitle": "string",
  "founderPortrait": "string",
  "founderQuote": "string",
  "narrativeTitle": "string",
  "narrativeParagraphs": ["string"],
  "values": [{ "title": "string", "description": "string" }],
  "timeline": [{ "year": "string", "title": "string", "text": "string" }],
  "actionStories": [{ "title": "string", "text": "string", "image": "string" }],
  "calloutTitle": "string",
  "calloutDescription": "string",
  "calloutPrimaryCta": "string",
  "calloutSecondaryCta": "string"
}
```

### 4.3 `page_slug = 'contact'`
```jsonc
{
  "heroEyebrow": "string",
  "heroTitle": "string",
  "heroDescription": "string",
  "contactHeading": "string",
  "address": "string",
  "phones": ["string"],
  "emails": ["string"],
  "presseTitle": "string",
  "presseText": "string",
  "projetsTitle": "string",
  "projetsText": "string",
  "formTitle": "string",
  "formFields": [{ "label": "string", "type": "string" }],
  "subjectOptions": ["string"],
  "submitCta": "string",
  "successMessage": "string",
  "contactCards": [{ "title": "string", "text": "string" }],
  "faq": [{ "question": "string", "answer": "string" }],
  "faqHeading": "string",
  "faqTitle": "string"
}
```

### 4.4 `page_settings` JSONB dans `global_settings`
```jsonc
{
  "home": {
    "heroEyebrow": "string",
    "heroTitle": "string",
    "heroDescription": "string",
    "heroPrimaryCta": "string",
    "heroSecondaryCta": "string"
  }
  // Même structure pour about, contact, projects, journal, gallery
}
```

### 4.5 `page_visibility` JSONB dans `global_settings`
```jsonc
{
  "home": {
    "emergencyBanner": true,
    "hero": true,
    "trustBar": true,
    "entryPoints": true,
    "projects": true,
    "mission": true,
    "journal": true,
    "transparency": true,
    "gallery": true,
    "donationCta": true,
    "newsletter": true,
    "footer": true
  }
  // Même structure pour about, contact
}
```

---

## 5. Stratégie d'Indexation

| Table | Index | Type | Justification |
|-------|-------|------|---------------|
| `projects` | `(status) WHERE deleted_at IS NULL` | B-tree partial | Filtrage projets actifs par statut |
| `projects` | `(theme) WHERE deleted_at IS NULL` | B-tree partial | Filtrage par thème |
| `projects` | `title` | GIN (jsonb_path_ops) | Recherche full-text sur titres traduits |
| `posts` | `(is_published, published_at DESC) WHERE deleted_at AND published` | B-tree partial composite | Listing articles publiés |
| `posts` | `category` | B-tree partial | Filtrage par catégorie |
| `posts` | `content` | GIN (jsonb_path_ops) | Recherche plein texte dans articles |
| `gallery_items` | `categories` | GIN (jsonb) | Filtrage par catégories |
| `nav_items` | `sort_order` | B-tree | Ordonnancement navigation |
| `content_versions` | `(versionable_id, versionable_type, created_at DESC)` | B-tree composite | Historique d'une entité |
| `media_morph` | `(mediable_id, mediable_type, role) WHERE role='cover'` | B-tree partial unique | Une seule cover par entité |

---

## 6. Flux de Données (Data Flow)

```
Frontend (Next.js) 
    ↓ Fetch API (REST/GraphQL)
Backend Laravel 
    ↓ Eloquent ORM
PostgreSQL 16+
    ↑ 
Admin Panel (Filament/Laravel Nova)
    ↓ 
Éditeurs → Versioning automatique → Audit trail
```

### Cycle de vie d'une mise à jour de contenu

```
1. Admin édite → Editor form
2. AJAX POST → Laravel Controller
3. Controller :
   a. Valide les données
   b. Snapshot l'état actuel → content_versions
   c. Met à jour la ligne
   d. Vide le cache (Cache::forget("page_content:$slug"))
4. Frontend Next.js :
   a. Cache layer (Redis) ou
   b. ISR (Incremental Static Regeneration) → revalidation webhook
```

---

## 7. API Endpoints (Anticipés)

### Pages contentaires (singletons)
```
GET    /api/pages/{slug}            → Récupère le contenu publié d'une page
PUT    /api/pages/{slug}            → Met à jour le contenu (admin only)
GET    /api/pages/{slug}/versions   → Liste les versions (admin only)
GET    /api/pages/{slug}/versions/{id} → Restaure une version
```

### Collections
```
GET    /api/projects                → Liste paginée/filtrée
POST   /api/projects                → Création
GET    /api/projects/{id}           → Détail
PUT    /api/projects/{id}           → Mise à jour
DELETE /api/projects/{id}           → Soft delete
POST   /api/projects/{id}/restore   → Restauration

GET    /api/posts                   → Paginé/filtré (catégorie, publié)
POST   /api/posts
GET    /api/posts/{id}
PUT    /api/posts/{id}
DELETE /api/posts/{id}

GET    /api/gallery                 → Paginé/filtré
POST   /api/gallery
DELETE /api/gallery/{id}

GET    /api/navigation              → Liste ordonnée
PUT    /api/navigation              → Réordonnancement complet
```

### Media (Upload)
```
POST   /api/media/upload            → Multipart upload → stockage S3/Local
GET    /api/media/{id}              → Infos fichier
DELETE /api/media/{id}
```

### Settings & Meta
```
GET    /api/settings                → Global settings
PUT    /api/settings                → Update (admin only)
GET    /api/settings/visibility     → Section visibility per page
PUT    /api/settings/visibility     → Update visibility
GET    /api/dashboard/kpi           → KPIs pour dashboard admin
```

---

## 8. Sécurité & Auditing

### Row-Level Security (PostgreSQL RLS) — Optionnel avancé
```sql
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
-- Les admins voient tout, les editors voient leurs propres versions
```

### Audit Trail
- `content_versions` stocke snapshot AVANT chaque modification
- `performed_by` partout : traçabilité complète
- `deleted_by` plutôt que suppression physique
- Trigger automatique : avant UPDATE, insérer snapshot dans `content_versions`

### Exemple de trigger fonctionnel
```sql
CREATE OR REPLACE FUNCTION versioning_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO content_versions (versionable_id, versionable_type, snapshot, action, performed_by)
        VALUES (OLD.id, TG_TABLE_NAME, row_to_json(OLD)::jsonb, 'updated', NEW.updated_by);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 9. Stratégie de Migration (Frontend → Backend)

| Phase | Action | Risque |
|-------|--------|--------|
| **1. Setup** | Créer le projet Laravel + migrations + seeders | Aucun |
| **2. Data seed** | Convertir les mock data en seeders Laravel | Faible |
| **3. API Read** | Exposer endpoints GET, garder localStorage parallèle | Moyen |
| **4. API Write** | Exposer endpoints CRUD, admin écrit en DB + localStorage | Moyen |
| **5. Cutover** | Supprimer localStorage, full DB | Élevé (nécessite sync) |
| **6. ISR Cache** | Configurer revalidation Next.js (on-demand ISR) | Faible |

### Script de migration des données (exemple pour projets)
```php
// database/seeders/ProjectSeeder.php
class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $projects = json_decode(
            file_get_contents(resource_path('mock-data/projects.json')),
            true
        );

        foreach ($projects as $data) {
            Project::create([
                'slug'             => $data['slug'],
                'theme'            => $data['theme'],
                'title'            => $data['title'],
                'description'      => $data['description'],
                'goal_amount'      => $data['goalAmount'],
                'collected_amount' => $data['collectedAmount'],
                'cover_image'      => $data['coverImage'],
                'status'           => $data['status'],
                'location'         => $data['location'],
                'beneficiary_label'=> $data['beneficiaryLabel'],
                'published_at'     => $data['createdAt'],
            ]);
        }
    }
}
```

---

## 10. Performance & Scale

| Scénario | Solution |
|----------|----------|
| **Contenu multilingue** | JSONB + spatie/laravel-translatable : pas de jointure N+1, 1 requête |
| **Recherche plein texte** | GIN index on JSONB + `to_tsvector('french', title->>'fr')` |
| **Pages statiques** | ISR Next.js revalidated via webhook Laravel |
| **Upload média** | Presigned S3 URLs, metadata seulement en DB |
| **Cache** | Redis : `pages:{slug}:{locale}`, invalidé à chaque UPDATE |
| **Historique volumineux** | `content_versions` partitionné par mois (PG partitioning) |
| **Gros volumes de projets** | Pagination cursor-based (UUIDv7) plutôt que offset |

---

## 11. Modèle Laravel (Exemple)

```php
// app/Models/Project.php
class Project extends Model
{
    use HasFactory, SoftDeletes, HasTranslations;

    protected $fillable = [
        'slug', 'theme', 'title', 'description', 'location',
        'beneficiary_label', 'goal_amount', 'collected_amount',
        'status', 'cover_image', 'published_at'
    ];

    public array $translatable = ['title', 'description', 'location', 'beneficiary_label'];

    protected function casts(): array
    {
        return [
            'goal_amount'      => 'integer',
            'collected_amount' => 'integer',
            'published_at'     => 'datetime',
        ];
    }

    public function media(): MorphToMany
    {
        return $this->morphToMany(GalleryItem::class, 'mediable', 'media_morph')
                    ->withPivot('role');
    }

    public function cover(): MorphOne
    {
        return $this->morphOne(GalleryItem::class, 'mediable', 'media_morph')
                    ->wherePivot('role', 'cover');
    }

    public function versions(): MorphMany
    {
        return $this->morphMany(ContentVersion::class, 'versionable');
    }
}
```

---

## 12. Résumé des Tables

| Table | Lignes estimées | Croissance | Stratégie cache |
|-------|-----------------|------------|-----------------|
| `users` | < 20 | Nulle | Pas de cache |
| `sessions` | < 50 | Faible | Redis TTL |
| `nav_items` | ~6 | Nulle | Cache permanent |
| `projects` | ~50 | +10/an | ISR + Redis |
| `posts` | ~30 | +20/an | ISR + Redis |
| `gallery_items` | ~100 | +30/an | CDN (images) + Redis (meta) |
| `page_content` | 6 | Nulle | Redis, invalidé sur PUT |
| `global_settings` | 1 | Nulle | Cache permanent |
| `content_versions` | ~500 | +100/an | Archive, pas de cache |
| `media_morph` | ~200 | +50/an | Pas de cache |

---

**Prochaine étape recommandée :** Créer la migration 000 `create_all_tables` en Laravel, ajouter les 18 fichiers seeder depuis les mock data existants, puis exposer les endpoints API REST que le frontend Next.js consommera via `fetch()` en remplacement de `localStorage.getItem()`.
