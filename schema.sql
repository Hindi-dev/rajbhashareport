-- ============================================================================
-- Rajbhasha Quarterly Progress Report (QPR) Database Schema
-- Adhering to the Revised Format of the Department of Official Language (April 2025)
-- Office of the Principal Director of Audit (PDA), Railway, Mumbai
-- Designed and Developed by: Bharat Bhushan, Senior Translation Officer (STO)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('DEO', 'AAO', 'SAO', 'HINDI_CELL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM (
        'DRAFT', 
        'PENDING_AAO', 
        'AAO_APPROVED', 
        'AAO_RETURNED', 
        'PENDING_SAO', 
        'SAO_APPROVED', 
        'SAO_RETURNED', 
        'SUBMITTED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150),
    role user_role NOT NULL DEFAULT 'DEO',
    section_name VARCHAR(150) NOT NULL,
    designation VARCHAR(150),
    phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. QPR REPORTS TABLE (Revised Format - April 2025)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ack_id VARCHAR(50) UNIQUE NOT NULL,
    section_name VARCHAR(150) NOT NULL,
    office_name_address TEXT NOT NULL,
    officer_phone VARCHAR(20) NOT NULL,
    officer_email VARCHAR(255) NOT NULL,
    region VARCHAR(5) NOT NULL DEFAULT 'ख',
    year VARCHAR(10) NOT NULL,
    quarter VARCHAR(10) NOT NULL,
    status report_status NOT NULL DEFAULT 'PENDING_AAO',

    -- Part 1: Section 3(3) Compliance
    b1_s3_total_issued INTEGER DEFAULT 0 CHECK (b1_s3_total_issued >= 0),
    b1_s3_bilingual INTEGER DEFAULT 0 CHECK (b1_s3_bilingual >= 0),
    b1_s3_english_only INTEGER DEFAULT 0 CHECK (b1_s3_english_only >= 0),
    b1_s3_hindi_only INTEGER DEFAULT 0 CHECK (b1_s3_hindi_only >= 0),

    -- Part 2: Rule 5 Compliance (Replies to letters received in Hindi)
    b1_s4_total_received INTEGER DEFAULT 0 CHECK (b1_s4_total_received >= 0),
    b1_s4_no_reply_needed INTEGER DEFAULT 0 CHECK (b1_s4_no_reply_needed >= 0),
    b1_s4_hindi_reply INTEGER DEFAULT 0 CHECK (b1_s4_hindi_reply >= 0),
    b1_s4_english_reply INTEGER DEFAULT 0 CHECK (b1_s4_english_reply >= 0),

    -- Part 3: English Letters Replied in Hindi (Region 'A' and Region 'B')
    b1_s5_ka_total INTEGER DEFAULT 0 CHECK (b1_s5_ka_total >= 0),
    b1_s5_ka_hindi_reply INTEGER DEFAULT 0 CHECK (b1_s5_ka_hindi_reply >= 0),
    b1_s5_ka_eng_reply INTEGER DEFAULT 0 CHECK (b1_s5_ka_eng_reply >= 0),
    b1_s5_ka_no_reply INTEGER DEFAULT 0 CHECK (b1_s5_ka_no_reply >= 0),
    b1_s5_kha_total INTEGER DEFAULT 0 CHECK (b1_s5_kha_total >= 0),
    b1_s5_kha_hindi_reply INTEGER DEFAULT 0 CHECK (b1_s5_kha_hindi_reply >= 0),
    b1_s5_kha_eng_reply INTEGER DEFAULT 0 CHECK (b1_s5_kha_eng_reply >= 0),
    b1_s5_kha_no_reply INTEGER DEFAULT 0 CHECK (b1_s5_kha_no_reply >= 0),

    -- Part 4: Originating Correspondence (Regions 'A', 'B', 'C')
    b1_s6_ka_hindi INTEGER DEFAULT 0 CHECK (b1_s6_ka_hindi >= 0),
    b1_s6_ka_english INTEGER DEFAULT 0 CHECK (b1_s6_ka_english >= 0),
    b1_s6_ka_total INTEGER DEFAULT 0 CHECK (b1_s6_ka_total >= 0),
    b1_s6_kha_hindi INTEGER DEFAULT 0 CHECK (b1_s6_kha_hindi >= 0),
    b1_s6_kha_english INTEGER DEFAULT 0 CHECK (b1_s6_kha_english >= 0),
    b1_s6_kha_total INTEGER DEFAULT 0 CHECK (b1_s6_kha_total >= 0),
    b1_s6_ga_hindi INTEGER DEFAULT 0 CHECK (b1_s6_ga_hindi >= 0),
    b1_s6_ga_english INTEGER DEFAULT 0 CHECK (b1_s6_ga_english >= 0),
    b1_s6_ga_total INTEGER DEFAULT 0 CHECK (b1_s6_ga_total >= 0),

    -- Part 5: File Notings (Tippan) - decimal support for 0.5 half-page rule
    b1_s7_hindi_pages NUMERIC(8, 1) DEFAULT 0.0 CHECK (b1_s7_hindi_pages >= 0),
    b1_s7_eng_pages NUMERIC(8, 1) DEFAULT 0.0 CHECK (b1_s7_eng_pages >= 0),
    b1_s7_total_pages NUMERIC(8, 1) DEFAULT 0.0 CHECK (b1_s7_total_pages >= 0),
    b1_s7_eoffice INTEGER DEFAULT 0,

    -- Part 6: Hindi Workshops Organized
    b1_s8_workshops INTEGER DEFAULT 0 CHECK (b1_s8_workshops >= 0),
    b1_s8_officers INTEGER DEFAULT 0 CHECK (b1_s8_officers >= 0),
    b1_s8_staff INTEGER DEFAULT 0 CHECK (b1_s8_staff >= 0),

    -- Part 7: OLIC (Rajbhasha Karyanvayan Samiti) Meetings
    b1_s9_meeting_held VARCHAR(10) DEFAULT 'हाँ',
    b1_s9_meeting_date DATE,
    b1_s9_agenda_hindi VARCHAR(10) DEFAULT 'हाँ',
    b1_s9_sub_office_cmtes INTEGER DEFAULT 0,
    b1_s9_sub_office_meetings INTEGER DEFAULT 0,

    -- Part 8: Special Achievements (Strictly max 250 characters)
    b1_s11_special_achievements VARCHAR(250),

    -- Part 9: Mandatory Declaration Certificate & PDF Upload
    b1_cert_name VARCHAR(150) NOT NULL,
    b1_cert_desig VARCHAR(150) NOT NULL,
    b1_cert_phone VARCHAR(20),
    b1_cert_date DATE,
    b1_cert_place VARCHAR(100),
    b1_cert_agreed BOOLEAN NOT NULL DEFAULT FALSE,
    certificate_pdf_url TEXT NOT NULL,
    certificate_pdf_name VARCHAR(255),
    certificate_pdf_size INTEGER,
    certificate_pdf_uploaded_at TIMESTAMPTZ,

    -- Workflow Audit & Security
    submitted_by UUID REFERENCES auth.users(id),
    timeline JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique index to prevent duplicate submissions per section/quarter/year unless returned
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_section_quarter_year 
ON public.reports (section_name, year, quarter) 
WHERE status NOT IN ('AAO_RETURNED', 'SAO_RETURNED');

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile; Hindi Cell can view all
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Hindi Cell can view all profiles" 
ON public.profiles FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'HINDI_CELL'
    )
);

-- Reports Policies:
-- DEO: Read & create own section's reports, update if Draft or Returned
CREATE POLICY "DEO report select" 
ON public.reports FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND (role = 'HINDI_CELL' OR section_name = reports.section_name)
    )
);

CREATE POLICY "DEO report insert" 
ON public.reports FOR INSERT 
TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'DEO' AND section_name = reports.section_name
    )
);

CREATE POLICY "DEO report update" 
ON public.reports FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND (
            (role = 'DEO' AND section_name = reports.section_name AND status IN ('DRAFT', 'AAO_RETURNED', 'SAO_RETURNED'))
            OR (role = 'AAO' AND status IN ('PENDING_AAO', 'SAO_RETURNED'))
            OR (role = 'SAO' AND status = 'PENDING_SAO')
            OR (role = 'HINDI_CELL')
        )
    )
);

-- 6. STORAGE BUCKET CONFIGURATION FOR CERTIFICATES
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'qpr-certificates', 
    'qpr-certificates', 
    false, 
    5242880, -- 5 MB
    ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['application/pdf'];

-- Storage RLS: Authenticated users can upload PDFs; authorized roles can view
CREATE POLICY "Allow authenticated users to upload PDF certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'qpr-certificates' 
    AND (storage.extension(name) = 'pdf')
);

CREATE POLICY "Allow authenticated users to read PDF certificates"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'qpr-certificates');
