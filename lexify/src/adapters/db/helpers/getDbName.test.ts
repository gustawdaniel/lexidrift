import { getDbName } from "./getDbName";
import { expect, test } from 'vitest'

test('getDbName dev', () => {
    const expected = 'lexi_drift';
    const actual = getDbName('mongodb://localhost:27017/lexi_drift');

    expect(actual).toBe(expected);
});

test('getDbName prod', () => {
    const expected = 'lexi_drift';
    const actual = getDbName('mongodb+srv://<user>:<password>@cluster.example.net/lexi_drift?retryWrites=true&w=majority');

    expect(actual).toBe(expected);
});

// Build command:pnpm build
// Build output:dist
// Root directory:
// Build comments:Enabled

// Secret
// 	MONGO_DB_NAME
// 	Value encrypted
	
// Secret
// 	MONGO_URI
// 	Value encrypted
	
// Plaintext
// 	NODE_ENV
// 	production

//  lexidrift-landing.pages.dev

// 	CNAME
	
// docs
	
// lexidrift-docs.pages.dev
	

// Proxied
	
// Auto
	
	

// 	CNAME
	
// lexidrift.com
	
// lexidrift-landing.pages.dev
	

// Proxied
	
// Auto