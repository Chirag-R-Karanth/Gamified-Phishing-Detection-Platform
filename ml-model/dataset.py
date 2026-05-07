import pandas as pd
import numpy as np

def calculate_entropy(strings):
    import math
    def entropy(s):
        p, lns = {}, float(len(s))
        for c in s: p[c] = p.get(c, 0) + 1
        return -sum(count/lns * math.log(count/lns, 2) for count in p.values())
    return [entropy(s) for s in strings]

def get_dummy_data(n_samples=2000):
    """
    Generates highly realistic synthetic data for phishing detection.
    Real-world features:
    - url_length: length of the URL
    - url_entropy: character randomness of the URL
    - has_https: 1 if secure protocol, 0 if not (many phishing sites now use https, but non-https is suspicious)
    - domain_age_days: Age of the registered domain
    - num_redirects: Number of HTTP redirects
    - body_richness: Ratio of HTML tags to text
    - sender_domain_mismatch: 1 if 'From' domain doesn't match 'Reply-To' or links
    - has_suspicious_keywords: 1 if words like 'urgent', 'verify', 'account' are present
    """
    np.random.seed(42)
    
    # Safe emails (Label = 0)
    # Introducing realistic noise: some legit emails look suspicious
    n_safe = n_samples // 2
    safe_url_length = np.random.normal(loc=55, scale=25, size=n_safe).astype(int)
    safe_url_entropy = np.random.normal(loc=3.8, scale=0.4, size=n_safe)
    safe_https = np.random.choice([0, 1], p=[0.10, 0.90], size=n_safe)
    safe_domain_age = np.random.exponential(scale=800, size=n_safe) + 30
    safe_redirects = np.random.poisson(lam=0.8, size=n_safe)
    safe_body_richness = np.random.normal(loc=0.25, scale=0.1, size=n_safe)
    safe_mismatch = np.random.choice([0, 1], p=[0.85, 0.15], size=n_safe) # Newsletters often have mismatches
    safe_suspicious = np.random.choice([0, 1], p=[0.70, 0.30], size=n_safe) # Legit emails often say "urgent" or "verify"
    
    # Phishing emails (Label = 1)
    # Phishing emails (Label = 1)
    # Introducing realistic noise: some phishing emails look very clean (compromised legit accounts)
    n_phish = n_samples - n_safe
    phish_url_length = np.random.normal(loc=65, scale=30, size=n_phish).astype(int)
    phish_url_entropy = np.random.normal(loc=4.2, scale=0.5, size=n_phish)
    phish_https = np.random.choice([0, 1], p=[0.20, 0.80], size=n_phish) # Most phishing now uses HTTPS
    phish_domain_age = np.random.exponential(scale=300, size=n_phish) + 5 # Many use compromised old domains
    phish_redirects = np.random.poisson(lam=1.5, size=n_phish)
    phish_body_richness = np.random.normal(loc=0.35, scale=0.15, size=n_phish) 
    phish_mismatch = np.random.choice([0, 1], p=[0.40, 0.60], size=n_phish) # Spear-phishing might not have mismatch
    phish_suspicious = np.random.choice([0, 1], p=[0.30, 0.70], size=n_phish)
    
    safe_df = pd.DataFrame({
        'url_length': safe_url_length,
        'url_entropy': safe_url_entropy,
        'has_https': safe_https,
        'domain_age_days': safe_domain_age,
        'num_redirects': safe_redirects,
        'body_richness': safe_body_richness,
        'sender_domain_mismatch': safe_mismatch,
        'has_suspicious_keywords': safe_suspicious,
        'label': 0
    })
    
    phish_df = pd.DataFrame({
        'url_length': phish_url_length,
        'url_entropy': phish_url_entropy,
        'has_https': phish_https,
        'domain_age_days': phish_domain_age,
        'num_redirects': phish_redirects,
        'body_richness': phish_body_richness,
        'sender_domain_mismatch': phish_mismatch,
        'has_suspicious_keywords': phish_suspicious,
        'label': 1
    })
    
    df = pd.concat([safe_df, phish_df]).sample(frac=1, random_state=42).reset_index(drop=True)
    
    # Clean up bounds
    df['url_length'] = df['url_length'].clip(lower=10)
    df['url_entropy'] = df['url_entropy'].clip(lower=1.0)
    df['body_richness'] = df['body_richness'].clip(lower=0.01, upper=0.99)
    df['domain_age_days'] = df['domain_age_days'].clip(lower=1).astype(int)
    
    X = df.drop('label', axis=1)
    y = df['label']
    
    return X, y

if __name__ == "__main__":
    # Test generation
    X, y = get_dummy_data(10)
    print("Generated Realistic Dataset Sample:")
    print(X.head())
