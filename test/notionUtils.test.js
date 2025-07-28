
const explanation = {
    // "id": "KQ%5E%3A",
    "type": "rich_text",
    "rich_text": [
        {
            "type": "text",
            "text": {
                "content": "calls init from parent class to contribute to own fields",
                "link": null
            },
            "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
            },
            "plain_text": "calls init from parent class to contribute to own fields",
            "href": null
        }
    ]
};

test("flattenPropertyValue for explanation rich text", async ()=>{
    // const result = await flattenPropertyValue(explanation);
    expect(
        await flattenPropertyValue(explanation)
    ).toBe("calls init from parent class to contribute to own fields")
});

test("just trying out explanation.rich_text", ()=>{
    expect(explanation.rich_text
    ).toEqual([
        {
            "type": "text",
            "text": {
                "content": "calls init from parent class to contribute to own fields",
                "link": null
            },
            "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
            },
            "plain_text": "calls init from parent class to contribute to own fields",
            "href": null
        }
    ])
})


test("trying out explanation.rich_text[0]", ()=>{
    expect(explanation.rich_text[0]

    ).toEqual(
        {
            "type": "text",
            "text": {
                "content": "calls init from parent class to contribute to own fields",
                "link": null
            },
            "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
            },
            "plain_text": "calls init from parent class to contribute to own fields",
            "href": null
        }
    )
})


test("trying out explanation.rich_text[0].text", ()=>{
    expect(explanation.rich_text[0].text

    ).toEqual(
        {
            "content": "calls init from parent class to contribute to own fields",
            "link": null
        }
    )
})


test("trying out explanation.rich_text[0].text.content", ()=>{
    expect(explanation.rich_text[0].text.content

    ).toEqual(
        "calls init from parent class to contribute to own fields"
    )
})





//-----------



const { flattenPropertyValue, flattenAllNotionProperties } = require("../utils/notionUtils");

describe('flattenPropertyValue', () => {
    // Existing rich_text test (already async)
    test("flattenPropertyValue for explanation rich text", async () => {
        const richText = {
            type: "rich_text",
            rich_text: [{
                type: "text",
                text: {
                    content: "calls init from parent class to contribute to own fields",
                    link: null
                }
            }]
        };
        expect(await flattenPropertyValue(richText)).toBe("calls init from parent class to contribute to own fields");
    });

    // // Relation test (already async)
    // test("flattenPropertyValue for relation", async () => {
    //     const mockGetRelationTitles = jest.fn().mockResolvedValue({
    //         '123': 'Relation Title 1',
    //         '456': 'Relation Title 2'
    //     });
    //     jest.mock('../utils/notionUtils.js', () => ({
    //         ...jest.requireActual('../utils/notionUtils.js'),
    //         getRelationTitles: mockGetRelationTitles
    //     }));

    //     const relation = {
    //         type: "relation",
    //         relation: [
    //             { id: "123" },
    //             { id: "456" }
    //         ]
    //     };
    //     const result = await flattenPropertyValue(relation);
    //     expect(result).toEqual([
    //         { id: "123", title: "Relation Title 1" },
    //         { id: "456", title: "Relation Title 2" }
    //     ]);
    // });

    // Title test
    test("flattenPropertyValue for title", async () => {
        const title = {
            type: "title",
            title: [{
                text: {
                    content: "Test Title"
                }
            }]
        };
        expect(await flattenPropertyValue(title)).toBe("Test Title");
    });

    // Text test
    test("flattenPropertyValue for text", async () => {
        const text = {
            type: "text",
            text: [{
                text: {
                    content: "Test Text"
                }
            }]
        };
        expect(await flattenPropertyValue(text)).toBe("Test Text");
    });

    // Number test
    test("flattenPropertyValue for number", async () => {
        const number = {
            type: "number",
            number: 42
        };
        expect(await flattenPropertyValue(number)).toBe(42);
    });

    // Select test
    test("flattenPropertyValue for select", async () => {
        const select = {
            type: "select",
            select: {
                name: "Option A"
            }
        };
        expect(await flattenPropertyValue(select)).toBe("Option A");
    });

    // Multi-select test
    test("flattenPropertyValue for multi_select", async () => {
        const multiSelect = {
            type: "multi_select",
            multi_select: [
                { name: "Option 1" },
                { name: "Option 2" }
            ]
        };
        expect(await flattenPropertyValue(multiSelect)).toBe("Option 1, Option 2");
    });

    // Date test
    test("flattenPropertyValue for date", async () => {
        const date = {
            type: "date",
            date: {
                start: "2025-07-27"
            }
        };
        expect(await flattenPropertyValue(date)).toBe("2025-07-27");
    });

    // Last edited time test
    test("flattenPropertyValue for last_edited_time", async () => {
        const lastEdited = {
            type: "last_edited_time",
            last_edited_time: "2025-07-27T22:57:28-05:00"
        };
        expect(await flattenPropertyValue(lastEdited)).toBe("2025-07-27T22:57:28-05:00");
    });

    // Created time test
    test("flattenPropertyValue for created_time", async () => {
        const created = {
            type: "created_time",
            created_time: "2025-07-27T22:57:28-05:00"
        };
        expect(await flattenPropertyValue(created)).toBe("2025-07-27T22:57:28-05:00");
    });

    // Checkbox test
    test("flattenPropertyValue for checkbox", async () => {
        const checkbox = {
            type: "checkbox",
            checkbox: true
        };
        expect(await flattenPropertyValue(checkbox)).toBe(true);
    });

    // Status test
    test("flattenPropertyValue for status", async () => {
        const status = {
            type: "status",
            status: {
                name: "In Progress"
            }
        };
        expect(await flattenPropertyValue(status)).toBe("In Progress");
    });

    // Email test
    test("flattenPropertyValue for email", async () => {
        const email = {
            type: "email",
            email: "test@example.com"
        };
        expect(await flattenPropertyValue(email)).toBe("test@example.com");
    });

    // Phone number test
    test("flattenPropertyValue for phone_number", async () => {
        const phone = {
            type: "phone_number",
            phone_number: "+1234567890"
        };
        expect(await flattenPropertyValue(phone)).toBe("+1234567890");
    });

    // Rollup test (already async)
    test("flattenPropertyValue for rollup", async () => {
        const rollup = {
            type: "rollup",
            rollup: {
                array: [{
                    type: "select",
                    select: {
                        name: "Rollup Value"
                    }
                }]
            }
        };
        expect(await flattenPropertyValue(rollup)).toBe("Rollup Value");
    });

    // Edge cases
    describe('edge cases', () => {
        test('handles null input', async () => {
            expect(await flattenPropertyValue(null)).toBeNull();
        });

        test('handles undefined input', async () => {
            expect(await flattenPropertyValue(undefined)).toBeNull();
        });

        test('handles unknown property type', async () => {
            const unknown = {
                type: "unknown_type",
                value: "some value"
            };
            expect(await flattenPropertyValue(unknown)).toBeNull();
        });

        test('handles empty object', async () => {
            expect(await flattenPropertyValue({})).toBeNull();
        });

        // test('handles missing type', async () => {
        //     const noType = {
        //         title: [{
        //             text: {
        //                 content: "Test Title"
        //             }
        //         }]
        //     };
        //     expect(await flattenPropertyValue(noType)).toBeNull();
        // });
    });
});