import React, { Component, render } from 'react';
import Filter from 'redux-filter';
import sweaters from './data.js';

const active = (appliedFilters, attribute, value) => {
    return appliedFilters[attribute] && (appliedFilters[attribute].indexOf(value) > -1);
};

class Filters extends Component {

    renderOptionGroup(group) {
        const { toggleFilter, appliedFilters } = this.props;
        return group.map((item, idx) => {
            const { attribute, value } = item;
            const isActive = active(appliedFilters, attribute, value);
            const style = {
                background: isActive ? 'yellow': 'white'
            };
            return <div key={idx} style={style} onClick={() => toggleFilter(attribute, value)}>
                {item.value}
            </div>;
        })

    }

    sortItems() {
        const { sortItems, applySort } = this.props;
        const handleSortChange = (e) => {
            if (!e.target.value) return;
            const idx = e.target.value;
            applySort(sortItems[idx]);
        };
        return <select onChange={(e) => handleSortChange(e)} >
            <option value="" disabled>Sort Functions</option>
            {sortItems.map((item, idx) => {
                return <option key={idx} value={idx}>{item.title}</option>
            })}
        </select>
    }

    render() {
        const { optionGroups, clearAllFilters } = this.props;
        const items = optionGroups.map((group, idx) => {
            const { title, values } = group;
            return <div key={idx}>
                <header>{title}</header>
                {this.renderOptionGroup((values))}
            </div>
        });
        return <div className="filters">
            <h2>Sorts</h2>
            {this.sortItems()}
            <h2>Filters</h2>
            {items}
            <h2>Clears</h2>
            <button onClick={() => clearAllFilters() }>Clear All Filters</button>
        </div>
    }
}

class Product extends Component {
    render() {
        const { color, type, price, size, designer, title } = this.props;
        const attributes = ['color', 'type', 'price', 'designer'];
        return <div className="product">
            <header>{title}</header>
            {attributes.map((attr, idx) => (
                <p key={idx}>{attr.toUpperCase()}: {this.props[attr]}</p>
            ))}
        </div>
    }
}

class App extends Component {

    render() {
        const {collection} = this.props;
        return <div className="product-filter">
            <Filters {...this.props} />
            <div className="products">
                {
                    collection.length ?
                    collection.map((product, idx) => <Product key={idx} {...product} />) :
                    <p>No Sweaters found.</p>
                }
            </div>
        </div>;
    }

}

const config = {
    subjects: sweaters,
    filterableCriteria: [
        {
            title: 'Sweater Type',
            attribute: 'type'
        },
        {
            title: 'Color',
            attribute: 'color'
        },
        {
            title: 'Size',
            attribute: 'size'
        },
        {
            title: 'Designer',
            attribute: 'designer'
        },
        {
            title: 'Retail Price',
            attribute: 'price',
            ranges: [
                {
                    displayValue: 'Up - $49.99',
                    range: {
                        min: 0,
                        max: 49.99
                    }
                },
                {
                    displayValue: '$50.00 - $99.99',
                    range: {
                        min: 50.00,
                        max: 99.99
                    }
                }
            ]
        }
    ],
    filterableCriteriaSortOptions: {
        type: (items) => [...items].sort()
    },
    sortItems: [
        {
            title: 'Price - Lowest to Highest',
            fn: (items) => {
                return [...items].sort((a, b) => a.price - b.price)
            }
        },
        {
            title: 'Price - Highest to Lowers',
            fn: (items) => {
                return [...items].sort((a, b) => b.price - a.price)
            }
        }
    ]
};


render(
    <Filter {...config}>
        <App />
    </Filter>,
    document.getElementById('root')
);