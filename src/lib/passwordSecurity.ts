/**
 * 密碼安全檢查工具
 * 使用 HaveIBeenPwned API 檢查密碼是否在洩漏資料庫中
 * 
 * 注意：Supabase 免費版不提供洩漏密碼保護功能
 * 此實作提供替代方案
 */

/**
 * 檢查密碼是否在 HaveIBeenPwned 洩漏資料庫中
 * 
 * 使用 k-anonymity 方法，只傳送密碼 SHA-1 雜湊的前 5 個字元
 * 完整密碼不會被傳送到外部服務
 * 
 * @param password 要檢查的密碼
 * @returns Promise<boolean> true 表示密碼已洩漏，false 表示安全
 */
export async function checkPasswordLeaked(password: string): Promise<boolean> {
    try {
        // 1. 計算密碼的 SHA-1 雜湊
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        
        // 2. 轉換為十六進位字串（大寫）
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase();
        
        // 3. 使用 k-anonymity：只傳送前 5 個字元
        const prefix = hashHex.slice(0, 5);
        const suffix = hashHex.slice(5);
        
        // 4. 查詢 HaveIBeenPwned API
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
            method: 'GET',
            headers: {
                'User-Agent': 'EverShine-Password-Checker'
            }
        });
        
        if (!response.ok) {
            // API 錯誤時，為了不阻擋使用者，返回 false（允許使用）
            console.warn('HaveIBeenPwned API 錯誤，允許密碼使用');
            return false;
        }
        
        const text = await response.text();
        
        // 5. 檢查後綴是否在結果中
        // API 返回格式：後綴:出現次數（每行一個）
        const lines = text.split('\n');
        const leaked = lines.some(line => {
            const [hashSuffix] = line.split(':');
            return hashSuffix === suffix;
        });
        
        return leaked;
        
    } catch (error) {
        // 發生錯誤時，為了不阻擋使用者，返回 false（允許使用）
        console.error('檢查密碼洩漏時發生錯誤:', error);
        return false;
    }
}

/**
 * 驗證密碼強度
 * 
 * @param password 要驗證的密碼
 * @returns 驗證結果 { valid: boolean, message: string }
 */
export function validatePasswordStrength(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
        return { valid: false, message: '密碼至少需要 8 個字元' };
    }
    
    if (password.length < 12) {
        return { valid: false, message: '建議使用至少 12 個字元的密碼' };
    }
    
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasNumber || !hasLetter) {
        return { valid: false, message: '密碼需要包含英文字母和數字' };
    }
    
    if (!hasSpecial) {
        return { valid: true, message: '建議加入特殊字元以提高安全性' };
    }
    
    return { valid: true, message: '密碼強度良好' };
}

/**
 * 完整的密碼驗證（強度 + 洩漏檢查）
 * 
 * @param password 要驗證的密碼
 * @returns Promise<{ valid: boolean; message: string }>
 */
export async function validatePassword(password: string): Promise<{ valid: boolean; message: string }> {
    // 1. 先檢查強度
    const strengthCheck = validatePasswordStrength(password);
    if (!strengthCheck.valid) {
        return strengthCheck;
    }
    
    // 2. 檢查是否洩漏
    const isLeaked = await checkPasswordLeaked(password);
    if (isLeaked) {
        return {
            valid: false,
            message: '此密碼已在洩漏資料庫中，請使用更安全的密碼'
        };
    }
    
    return { valid: true, message: strengthCheck.message };
}
