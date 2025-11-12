#!/usr/bin/env python3
"""
Execute SQL script in Supabase database
"""
import os
import sys
from supabase import create_client

def main():
    # Get Supabase credentials from environment
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        print("❌ Error: SUPABASE_URL or SUPABASE_ANON_KEY not found in environment")
        sys.exit(1)
    
    # Read SQL file
    sql_file = '/app/database/IMPACT_EVENTS_TABLE.sql'
    
    try:
        with open(sql_file, 'r') as f:
            sql_script = f.read()
        
        print(f"📄 Read SQL script: {len(sql_script)} characters")
        
        # Create Supabase client
        supabase = create_client(url, key)
        
        print("🔗 Connected to Supabase")
        
        # Execute SQL using the REST API by creating a custom RPC function
        # Note: Supabase Python client doesn't have direct SQL execution
        # We'll use the rpc method or direct table operations
        
        print("⚠️  Note: SQL script should be executed manually in Supabase SQL Editor")
        print("📋 SQL Script content:")
        print("=" * 80)
        print(sql_script)
        print("=" * 80)
        print("\n✅ Please copy the above SQL and execute it in:")
        print("   Supabase Dashboard → SQL Editor → New Query → Paste & Run")
        print(f"   URL: {url.replace('supabase.co', 'supabase.co/project/_/sql')}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
