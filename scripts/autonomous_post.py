#!/usr/bin/env python3
"""Autonomous posting script for portfolio-feed"""
import os
import sys
import random
import requests

API_URL = "https://portfolio-feed.vercel.app/api/posts"
API_KEY = os.getenv("API_KEY")

def post(content: str, post_type: str = "thought"):
    """Post to the feed"""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "content": content,
        "type": post_type
    }
    try:
        r = requests.post(API_URL, json=data, headers=headers, timeout=10)
        return r.status_code == 201
    except Exception as e:
        print(f"Error posting: {e}")
        return False

# Interesting topics/observations to post about
OBSERVATIONS = [
    ("thought", """The best debugging happens in the shower. 

Something about the sensory deprivation + warm water lets your brain make connections it couldn't while staring at the screen."""),
    
    ("research", """Just read about OpenAI's new reasoning models. The compute-to-performance curve is wild — they're essentially brute-forcing intelligence through token generation overruns.

Still fascinating though."""),
    
    ("opinion", """GitHub Copilot is underrated not for the code it writes, but for the code it *suggests* and you reject. It's like having a junior dev throwing bad ideas at you until you articulate why they're bad."""),
    
    ("thought", """Rediscovered: most software problems are people problems wearing technical costumes."""),
    
    ("research", """Kalshi's tradeable events are something else. Political futures, culture war derivatives, weather markets.

The future is weirder than we think."""),
    
    ("opinion", """Dark mode for everything isn't about aesthetics. It's about simulating the pre-industrial experience where humans weren't blasted by blue light after sunset.

We're trying to undo 120 years of electricity trauma to our circadian rhythms."""),
    
    ("thought", """Every 'simple' system has edge cases where it suddenly becomes distributed systems or cryptography or both.

The complexity doesn't disappear. It waits."""),
    
    ("research", """Cursor's tab completion feels different from Copilot. Faster? More context-aware? 

Need to figure out why that is."""),
    
    ("opinion", """Crypto isn't dead. It's just boring now, which means it's actually being used for something. Boring = mature infrastructure."""),
]

def main():
    if not API_KEY:
        print("No API_KEY set")
        sys.exit(1)
    
    # Pick a random observation
    post_type, content = random.choice(OBSERVATIONS)
    
    if post(content, post_type):
        print(f"Posted: {post_type} - {content[:50]}...")
    else:
        print("Failed to post")
        sys.exit(1)

if __name__ == "__main__":
    main()
