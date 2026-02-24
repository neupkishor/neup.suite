export const parseManualFields = (templateBody: string): string[] => {
    if (!templateBody) return [];
    const regex = /\{\{manual\.(\w+)\}\}/g;
    const matches = [...templateBody.matchAll(regex)];
    return [...new Set(matches.map(match => match[1]))];
};

export const renderTemplate = (templateBody: string, data: Record<string, any>): string => {
  let rendered = templateBody;

  // Replace simple placeholders like {{client.name}}
  const simpleRegex = /\{\{client\.(\w+)\}\}/g;
  rendered = rendered.replace(simpleRegex, (match, key) => {
    return data.client?.[key] || match;
  });

  // Replace manual placeholders like {{manual.customNote}}
  const manualRegex = /\{\{manual\.(\w+)\}\}/g;
  rendered = rendered.replace(manualRegex, (match, p1) => {
    return data.manual?.[p1] || match;
  });

  // Handle simple loops like {{#each tasks}}...{{/each}}
  const loopRegex = /\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
    rendered = rendered.replace(loopRegex, (match, p1, innerTemplate) => {
        const items = data[p1];
        if (!Array.isArray(items)) return '';
        
        let allItemsHtml = '';
        for (const item of items) {
            let itemHtml = innerTemplate;
            const itemRegex = /\{\{this\.(\w+)\}\}/g;
            itemHtml = itemHtml.replace(itemRegex, (itemMatch: string, itemKey: string) => {
                // Access nested properties if any
                const keys = itemKey.split('.');
                let value = item;
                for (const key of keys) {
                    if (value && typeof value === 'object' && key in value) {
                        value = value[key];
                    } else {
                        return itemMatch;
                    }
                }
                // Ensure value is a string or primitive we can render
                return String(value ?? '');
            });
            allItemsHtml += itemHtml;
        }
        return allItemsHtml;
    });

  return rendered;
};
