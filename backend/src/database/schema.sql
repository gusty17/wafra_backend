
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),

    password VARCHAR(255) NOT NULL,

    role VARCHAR(20) NOT NULL CHECK (
        role IN ('restaurant', 'individual', 'foodbank')
    ),

    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (
        verification_status IN ('pending', 'approved', 'rejected')
    ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS restaurants (
    restaurant_id SERIAL PRIMARY KEY,

    user_id INT UNIQUE NOT NULL,

    restaurant_name VARCHAR(150) NOT NULL,
    cuisine_type VARCHAR(100),
    license_number VARCHAR(100),
    location TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS food_banks (
    food_bank_id SERIAL PRIMARY KEY,

    user_id INT UNIQUE NOT NULL,

    organization_name VARCHAR(150) NOT NULL,
    registration_number VARCHAR(100),
    location TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS individuals (
    individual_id SERIAL PRIMARY KEY,

    user_id INT UNIQUE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS food_listings (
    listing_id SERIAL PRIMARY KEY,

    restaurant_id INT NOT NULL,

    food_name VARCHAR(150) NOT NULL,
    category VARCHAR(100),
    quantity DOUBLE PRECISION NOT NULL CHECK (quantity > 0),

    pickup_time TIMESTAMP NOT NULL,
    location TEXT,

    photo_url TEXT,
    dietary_tags TEXT,

    status VARCHAR(20) DEFAULT 'available' CHECK (
        status IN ('available', 'reserved', 'completed', 'cancelled')
    ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS reservations (
    reservation_id SERIAL PRIMARY KEY,

    listing_id INT NOT NULL,
    user_id INT NOT NULL,

    requested_quantity DOUBLE PRECISION NOT NULL CHECK (requested_quantity > 0),

    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN ('pending', 'accepted', 'declined', 'cancelled', 'completed')
    ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (listing_id) REFERENCES food_listings(listing_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS pickups (
    pickup_id SERIAL PRIMARY KEY,

    reservation_id INT UNIQUE NOT NULL,

    code VARCHAR(10) NOT NULL,
    qr_code TEXT,

    status VARCHAR(20) DEFAULT 'active' CHECK (
        status IN ('active', 'used', 'expired')
    ),

    expires_at TIMESTAMP,
    confirmed_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,

    user_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);



