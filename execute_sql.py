#!/usr/bin/env python3
"""
Execute SQL script in Supabase database using direct PostgreSQL connection
"""
import os
import sys
import re

def main():
    # Get Supabase URL from environment
    url = os.environ.get('SUPABASE_URL', '')
    
    if not url:
        print("❌ Error: SUPABASE_URL not found in environment")
        sys.exit(1)
    
    # Parse project ID from URL
    match = re.search(r'https://([^.]+)\.supabase\.co', url)
    if not match:
        print("❌ Error: Could not parse project ID from SUPABASE_URL")
        sys.exit(1)
    
    project_id = match.group(1)
    
    # Construct PostgreSQL connection string for Supabase
    # Note: Supabase uses port 5432 for direct database connections
    # Password would need to be provided separately
    db_host = f"db.{project_id}.supabase.co"
    db_port = "5432"
    db_name = "postgres"
    db_user = "postgres"
    
    print(f"📊 Supabase Project: {project_id}")
    print(f"🔗 Database Host: {db_host}")
    
    # Read SQL file
    sql_file = '/app/database/IMPACT_EVENTS_TABLE.sql'
    
    try:
        with open(sql_file, 'r') as f:
            sql_script = f.read()
        
        print(f"📄 Read SQL script: {len(sql_script)} characters")
        
        # Try to connect and execute
        try:
            import psycopg2
            
            # Try to get password from environment (if set)
            db_password = os.environ.get('SUPABASE_DB_PASSWORD', '')
            
            if not db_password:
                print("\n⚠️  Direct database connection requires SUPABASE_DB_PASSWORD")
                print("📋 Displaying SQL for manual execution:\n")
                print("=" * 80)
                print(sql_script)
                print("=" * 80)
                print("\n✅ Copy the above SQL and execute it in:")
                print("   Supabase Dashboard → SQL Editor → New Query")
                print(f"   URL: https://supabase.com/dashboard/project/{project_id}/sql/new")
                return
            
            # Connect to database
            conn = psycopg2.connect(
                host=db_host,
                port=db_port,
                database=db_name,
                user=db_user,
                password=db_password
            )
            
            print("✅ Connected to PostgreSQL database")
            
            # Execute SQL
            cursor = conn.cursor()
            cursor.execute(sql_script)
            conn.commit()
            
            print("✅ SQL script executed successfully!")
            
            cursor.close()
            conn.close()
            
        except ImportError:
            print("⚠️  psycopg2 not available, showing SQL for manual execution")
            print("📋 SQL Script:\n")
            print("=" * 80)
            print(sql_script)
            print("=" * 80)
        except Exception as db_error:
            print(f"⚠️  Database connection failed: {db_error}")
            print("\n📋 Displaying SQL for manual execution:\n")
            print("=" * 80)
            print(sql_script)
            print("=" * 80)
            print("\n✅ Copy the above SQL and execute it in:")
            print("   Supabase Dashboard → SQL Editor → New Query")
            print(f"   URL: https://supabase.com/dashboard/project/{project_id}/sql/new")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
