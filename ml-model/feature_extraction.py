import re

def extract_features(text, url):
    """
    Extracts basic features from email text and URL for the ML model.
    """
    urgent_keywords = ['urgent', 'immediate action', 'verify', 'suspend', 'account closed']
    
    features = {
        'url_length': len(url) if url else 0,
        'num_dots': url.count('.') if url else 0,
        'has_urgent_keywords': int(any(keyword in text.lower() for keyword in urgent_keywords))
    }
    
    return features

if __name__ == "__main__":
    # Test feature extraction
    sample_text = "URGENT: Please verify your account immediately."
    sample_url = "http://secure-login.paypal.verify-account.com/auth"
    
    print(f"Extracted features: {extract_features(sample_text, sample_url)}")
