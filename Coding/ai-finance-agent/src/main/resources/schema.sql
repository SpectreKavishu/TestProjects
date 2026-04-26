CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS indian_stocks (
    embedding_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    embedding vector(384),
    text TEXT,
    metadata JSONB
);

-- Insert 5 sample Indian stocks
INSERT INTO indian_stocks (text, metadata) VALUES
('Reliance Industries is an Indian multinational conglomerate, headquartered in Mumbai. It has diverse businesses including energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles. One of the largest and most profitable companies in India.', '{"ticker": "RELIANCE", "company_name": "Reliance Industries Limited"}'),
('Tata Consultancy Services is an Indian multinational information technology services and consulting company. It is a subsidiary of the Tata Group and operates in 150 locations across 46 countries, known for its software engineering excellence and IT outsourcing.', '{"ticker": "TCS", "company_name": "Tata Consultancy Services"}'),
('HDFC Bank Limited is an Indian banking and financial services company headquartered in Mumbai. It is India''s largest private sector bank by assets and the world''s tenth-largest bank by market capitalization, offering various loans, retail banking, and corporate banking.', '{"ticker": "HDFCBANK", "company_name": "HDFC Bank"}'),
('Infosys is an Indian multinational information technology company that provides business consulting, information technology and outsourcing services. The company was founded in Pune and is headquartered in Bangalore.', '{"ticker": "INFY", "company_name": "Infosys Limited"}'),
('ICICI Bank Limited is an Indian multinational bank and financial services company headquartered in Mumbai. It offers a wide range of banking products and financial services for corporate and retail customers through a variety of delivery channels and specialized subsidiaries.', '{"ticker": "ICICIBANK", "company_name": "ICICI Bank"}')
ON CONFLICT DO NOTHING;
