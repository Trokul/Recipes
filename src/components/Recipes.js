import React from 'react';

import { RecipesContext } from './RecipesContext';

import './Recipes.css';
import RecipesTree from './RecipesTree';

class Recipes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currItem: null,
            changeItem: item => {
                this.setState({ currItem: item });
            }
        };
    }

    renderFileOrView() {
        if (this.state.currItem) {
            if (this.state.currItem.name) {
                return (
                    <iframe
                        src={`${this.state.currItem.url}embedview`}
                        title="תצוגת קובץ"
                        frameborder="0"
                    />
                );
            } else {
                return 'העלאת קבצים';
            }
        } else {
            return 'אנא בחר קובץ או תיקייה מן העץ בצד ימין';
        }
    }

    render() {
        return (
            <RecipesContext.Provider value={this.state}>
                <h1>חוברת מתכונים online</h1>
                <div className="recipes-grid">
                    <div>
                        <RecipesTree />
                    </div>
                    <div>{this.renderFileOrView()}</div>
                </div>
            </RecipesContext.Provider>
        );
    }
}

export default Recipes;
