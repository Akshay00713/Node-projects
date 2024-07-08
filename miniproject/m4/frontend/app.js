// frontend/app.js
document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:5000/api/crypto';
    let currentPage = 1;
    const limit = 10;
    let totalPages = 1;
    let currentData = [];

    const tableBody = document.getElementById('tableBody');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const detailsModal = document.getElementById('detailsModal');
    const detailsContent = document.getElementById('detailsContent');
    const closeModal = document.querySelector('.close');

    // Function to fetch cryptocurrency data
    const fetchData = async (query = '') => {
        try {
            const response = await fetch(`${apiUrl}?page=${currentPage}&limit=${limit}&query=${query}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            currentData = data;
            totalPages = Math.ceil(data.length / limit);
            renderTable(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Function to render table rows
    const renderTable = (data) => {
        tableBody.innerHTML = '';
        data.forEach((crypto, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${crypto.market_cap_rank}</td>
                <td>${crypto.name}</td>
                <td>${crypto.symbol.toUpperCase()}</td>
                <td>$${crypto.current_price.toLocaleString()}</td>
                <td>$${crypto.market_cap.toLocaleString()}</td>
                <td class="${crypto.price_change_percentage_24h > 0 ? 'positive' : 'negative'}">
                    ${crypto.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td>
                    <button class="detailsButton" data-id="${crypto.id}">Details</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listeners to the details buttons
        document.querySelectorAll('.detailsButton').forEach(button => {
            button.addEventListener('click', (e) => {
                showDetailsModal(e.target.dataset.id);
            });
        });
    };

    // Function to handle pagination
    const handlePagination = (direction) => {
        if (direction === 'prev' && currentPage > 1) {
            currentPage--;
        } else if (direction === 'next' && currentPage < totalPages) {
            currentPage++;
        }
        fetchData(searchInput.value);
    };

    // Function to show cryptocurrency details modal
    const showDetailsModal = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/crypto/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch details');
            }
            const crypto = await response.json();
            detailsContent.innerHTML = `
                <p><strong>Name:</strong> ${crypto.name}</p>
                <p><strong>Symbol:</strong> ${crypto.symbol.toUpperCase()}</p>
                <p><strong>Current Price:</strong> $${crypto.market_data.current_price.usd.toLocaleString()}</p>
                <p><strong>Market Cap:</strong> $${crypto.market_data.market_cap.usd.toLocaleString()}</p>
                <p><strong>24h Change:</strong> ${crypto.market_data.price_change_percentage_24h.toFixed(2)}%</p>
                <p><strong>Description:</strong> ${crypto.description.en}</p>
            `;
            detailsModal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };

    // Function to handle search
    const handleSearch = () => {
        currentPage = 1;
        fetchData(searchInput.value);
    };

    // Event listeners
    prevButton.addEventListener('click', () => handlePagination('prev'));
    nextButton.addEventListener('click', () => handlePagination('next'));
    searchButton.addEventListener('click', handleSearch);
    closeModal.addEventListener('click', () => {
        detailsModal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target == detailsModal) {
            detailsModal.style.display = 'none';
        }
    });

    // Initial fetch
    fetchData();
});


