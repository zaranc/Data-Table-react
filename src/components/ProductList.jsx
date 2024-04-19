// ProductList.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ProductList = () => {

    let name = useRef();
    let price = useRef();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('price');
    const [update, setupdate] = useState({})

    useEffect(() => {
        fetchData();
    }, []);

    // Get Products Data
    const fetchData = () => {
        axios.get('http://localhost:3001/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    };

    // Add Products
    const addProduct = async () => {
        let obj = {
            name: name.current.value,
            price: price.current.value
        }

        let result = await axios.post('http://localhost:3001/products', obj)
        setProducts([...products, result.data])
    }

    // Delete Product
    const deleteProduct = async (id) => {
        let deletedProduct = await axios.delete(`http://localhost:3001/products/${id}`)
        setProducts(products.filter((product) => product.id !== id))
    }
    // Update Products Data
    const viewdata = (id) => {
        const user = products.find(product => product.id === id);
        setupdate(user);
    }

    const updateHandler = (e) => {
        setupdate({ ...update, [e.target.name]: e.target.value })
    }

    const updateProduct = async () => {
        let updatedData = await axios.put(`http://localhost:3001/products/${update.id}`, update)
        console.log(updatedData);

        setProducts(products.map((val, ind) => {
            if (val.id == updatedData.data.id) {
                return updatedData.data
            } else {
                return val
            }
        })
        )
    }

    // Searching products
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Sorting products 
    const handleSort = (event) => {
        setSortBy(event.target.value);
    };

    //  Updating Shorted Products
    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'price') {
            return a.price - b.price;
        } else if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });

    //  Filtering products
    const filteredProducts = sortedProducts.filter(product =>
        product.price.toString().includes(searchTerm) || product.name.toLowerCase().includes(searchTerm.toLowerCase())

    );

    return (
        <>
            <div className='inputfields row col-12 mb-5'>

                <div className='col-6'>
                    <h1>Add products</h1>
                    <input type="text" placeholder='Product Name' ref={name} />
                    <input type="text" placeholder='Price' ref={price} />
                    <button className='btn btn-info' onClick={addProduct} style={{width:"100%"}}>Add</button>
                </div>
                <div className='col-6'>
                    <h1>Product Dashboard</h1>
                    <input
                        type="text"
                        placeholder="Search by name or price..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <select onChange={handleSort} value={sortBy}>
                        <option value="name">Sort by Name</option>
                        <option value="price">Sort by Price</option>
                    </select>
                </div>
            </div> <table class="table table-bordered text-center">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Update</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredProducts.map((product, index) => {
                            return (
                                <>


                                    <tr>
                                        <th scope="row">{product.id}</th>
                                        <td>{product.name}</td>
                                        <td>${product.price}</td>
                                        <td style={{ width: '75px' }}><button className='btn btn-primary' data-toggle="modal" data-target="#exampleModal" onClick={() => viewdata(product.id)}>Edit</button>
                                        </td>
                                        <td style={{ width: '100px' }}><button className='btn btn-outline-danger' onClick={() => deleteProduct(product.id)}>Delete</button>
                                        </td>
                                    </tr>
                                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                    <input type="text" value={update.name} placeholder='Product Name' name='name' onChange={updateHandler} />
                                                    <input type="text" value={update.price} placeholder='Price' name='price' onChange={updateHandler} />
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                    <button type="button" class="btn btn-primary" data-dismiss="modal"  onClick={updateProduct}>Update</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })
                    }
                </tbody >
            </table>
        </>
    );
};

export default ProductList;
