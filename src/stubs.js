export const tree = [
    {
        nodeId: 1,
        title: 'מנות ראשונות',
        files: [],
        folders: []
    },
    {
        nodeId: 2,
        title: 'סלטים',
        files: [],
        folders: []
    },
    {
        nodeId: 3,
        title: 'תוספות',
        files: [
            {
                nodeId: 8,
                name: 'פיתות ביתיות',
                url:
                    'https://colman365-my.sharepoint.com/:w:/r/personal/313363103_stud_colman_ac_il/_layouts/15/Doc.aspx?sourcedoc=%7Be4214547-0725-4b39-8e11-bf8f2e64372b%7D&cid=387c178e-9330-4efa-8f72-24a7a1f7bb9e&action='
            }
        ],
        folders: []
    },
    {
        nodeId: 4,
        title: 'מנות עיקריות',
        files: [],
        folders: []
    },
    {
        nodeId: 5,
        title: 'קינוחים',
        files: [],
        folders: []
    },
    {
        nodeId: 6,
        title: 'קוקטיילים',
        files: [],
        folders: []
    },
    {
        nodeId: 7,
        title: 'מתכונים להכנה עם ילדים',
        files: [],
        folders: [
            {
                nodeId: 9,
                title: 'ארוחות בוקר',
                files: [],
                folders: []
            }
        ]
    }
];

let lastNodeId = 9;
export const getLastNodeId = () => ++lastNodeId;
