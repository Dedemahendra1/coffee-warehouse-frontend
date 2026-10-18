# Prompt Diagram UML untuk draw.io (diagrams.net)

Cara pakai kode Mermaid di draw.io:
`+ (Insert)` → `Advanced` → `Mermaid...` → tempel kode → `Insert`.
Hasilnya bisa digeser/diedit seperti shape biasa.
Alternatif: tempel bagian "Prompt Deskriptif" ke AI lain, atau gambar manual mengikuti daftar elemen.

---

## 1. USE CASE DIAGRAM

### Prompt Deskriptif
> Buat use case diagram sistem "Senopati Coffee" dengan 2 aktor: Manager (kiri) dan Keeper (kanan), dan satu system boundary "Sistem Senopati Coffee".
> Use case Manager: Login, Kelola Kategori, Kelola Produk, Kelola Gudang, Kelola Outlet, Kelola User, Assign Role ke User, Monitoring Transaksi (lihat semua), Lihat Laporan Reports, Ekspor Excel (.xlsx).
> Use case Keeper: Login, Tambah Stok Gudang, Ubah Stok Gudang, Distribusi Stok ke Outlet, Ubah Distribusi Stok, Catat Stock Out, Lihat Stok Outlet Saya, Overview Outlet Saya, Profil Outlet Saya.
> Relasi: kedua aktor terhubung ke Login. Dashed arrow «include» dari "Lihat Laporan Reports" ke "Ekspor Excel". Semua use case membutuhkan autentikasi Bearer Token.

### Kode Mermaid (import ke draw.io)
```
flowchart LR
    M(["Actor: Manager"])
    K(["Actor: Keeper"])
    subgraph SYS["Sistem Senopati Coffee"]
        UC1(["Login"])
        UC2(["Kelola Kategori"])
        UC3(["Kelola Produk"])
        UC4(["Kelola Gudang"])
        UC5(["Kelola Outlet"])
        UC6(["Kelola User"])
        UC7(["Assign Role ke User"])
        UC8(["Monitoring Transaksi"])
        UC9(["Lihat Laporan Reports"])
        UC10(["Ekspor Excel"])
        UC11(["Tambah Stok Gudang"])
        UC12(["Ubah Stok Gudang"])
        UC13(["Distribusi Stok ke Outlet"])
        UC14(["Ubah Distribusi Stok"])
        UC15(["Catat Stock Out"])
        UC16(["Lihat Stok Outlet Saya"])
        UC17(["Overview Outlet Saya"])
        UC18(["Profil Outlet Saya"])
    end
    M --> UC1
    M --> UC2
    M --> UC3
    M --> UC4
    M --> UC5
    M --> UC6
    M --> UC7
    M --> UC8
    M --> UC9
    K --> UC1
    K --> UC11
    K --> UC12
    K --> UC13
    K --> UC14
    K --> UC15
    K --> UC16
    K --> UC17
    K --> UC18
    UC9 -. "<<include>>" .-> UC10
```

---

## 2. ACTIVITY DIAGRAM

### Prompt Deskriptif
> Buat activity diagram alur operasional stok harian Senopati Coffee. Mulai -> Login -> decision "Role?".
> Cabang Manager: Kelola Master Data -> Monitoring Overview & Reports -> Ekspor Excel -> merge.
> Cabang Keeper: Tambah Stok ke Gudang -> Isi Form Distribusi (produk, qty) -> decision "Stok gudang cukup?" ; jika Tidak -> Tampilkan error -> kembali ke Isi Form Distribusi (loop) ; jika Ya -> Kurangi Stok Gudang & Tambah Stok Outlet -> Catat Stock Out (opsional) -> merge -> Selesai.
> Swimlane opsional: kolom Manager dan kolom Keeper.

### Kode Mermaid
```
flowchart TD
    A([Mulai]) --> B[Login]
    B --> C{Role?}
    C -->|Manager| D[Kelola Master Data]
    D --> E["Monitoring: Overview & Reports"]
    E --> F["Ekspor Excel (.xlsx)"]
    C -->|Keeper| G[Tambah Stok ke Gudang]
    G --> H["Isi Form Distribusi (produk, qty)"]
    H --> I{Stok gudang cukup?}
    I -->|Tidak| J[Tampilkan error]
    J --> H
    I -->|Ya| K[Kurangi Stok Gudang dan Tambah Stok Outlet]
    K --> L["Catat Stock Out (opsional)"]
    F --> M([Selesai])
    L --> M
```

---

## 3. CLASS DIAGRAM

### Prompt Deskriptif
> Buat class diagram domain Senopati Coffee dengan 10 kelas beserta atribut dan method relasi Eloquent:
> - User(id, name, email, phone, photo, password; +merchant())
> - Category(id, name, photo, tagline; +products())
> - Product(id, name, thumbnail, about, unit, price, category_id FK, is_popular; +category(), +warehouses(), +merchants())
> - Warehouse(id, name, address, photo, phone; +products())
> - Merchant/Outlet(id, name, address, photo, keeper_id FK; +keeper(), +products(), +transactions())
> - WarehouseProduct(id, warehouse_id FK, product_id FK, stock)
> - MerchantProduct(id, merchant_id FK, product_id FK, warehouse_id FK, stock)
> - Transaction(id, name, phone, sub_total, tax_total, grand_total, merchant_id FK; +transactionProducts())
> - TransactionProduct(id, transaction_id FK, product_id FK, quantity, price, sub_total)
> - StockOut(id, merchant_id FK, product_id FK, quantity, reason, user_id FK nullable)
> Relasi: Category 1-* Product; Product *-* Warehouse lewat WarehouseProduct; Product *-* Merchant lewat MerchantProduct; Warehouse 1-* MerchantProduct; Merchant 1-* MerchantProduct; User 1-1 Merchant (keeper); Merchant 1-* Transaction; Transaction 1-* TransactionProduct; Product 1-* TransactionProduct; Merchant 1-* StockOut; Product 1-* StockOut; User 0..1-* StockOut (pencatat).

### Kode Mermaid
```
classDiagram
    class User {
        -id
        -name
        -email
        -phone
        -photo
        -password
        +merchant() Merchant
    }
    class Category {
        -id
        -name
        -photo
        -tagline
        +products()
    }
    class Product {
        -id
        -name
        -thumbnail
        -about
        -unit
        -price
        -category_id
        -is_popular
        +category()
        +warehouses()
        +merchants()
    }
    class Warehouse {
        -id
        -name
        -address
        -photo
        -phone
        +products()
    }
    class Merchant {
        -id
        -name
        -address
        -photo
        -keeper_id
        +keeper() User
        +products()
        +transactions()
    }
    class WarehouseProduct {
        -id
        -warehouse_id
        -product_id
        -stock
    }
    class MerchantProduct {
        -id
        -merchant_id
        -product_id
        -warehouse_id
        -stock
    }
    class Transaction {
        -id
        -name
        -phone
        -sub_total
        -tax_total
        -grand_total
        -merchant_id
        +transactionProducts()
    }
    class TransactionProduct {
        -id
        -transaction_id
        -product_id
        -quantity
        -price
        -sub_total
    }
    class StockOut {
        -id
        -merchant_id
        -product_id
        -quantity
        -reason
        -user_id
    }
    Category "1" --> "*" Product
    Product "1" --> "*" WarehouseProduct
    Warehouse "1" --> "*" WarehouseProduct
    Product "1" --> "*" MerchantProduct
    Warehouse "1" --> "*" MerchantProduct
    Merchant "1" --> "*" MerchantProduct
    User "1" --> "1" Merchant : keeper
    Merchant "1" --> "*" Transaction
    Transaction "1" --> "*" TransactionProduct
    Product "1" --> "*" TransactionProduct
    Merchant "1" --> "*" StockOut
    Product "1" --> "*" StockOut
    User "0..1" --> "*" StockOut : pencatat
```

---

## 4. SEQUENCE DIAGRAM

### Prompt Deskriptif
> Buat sequence diagram dengan dua skenario.
> Skenario 1 (Login): Aktor -> LoginPage: isi email & password; LoginPage -> authService: login(email, password); authService -> axiosConfig: POST /api/login; axiosConfig -> API Laravel; API -> Database: SELECT user + INSERT token; balikan 200 {token, user}; authService menyimpan token ke localStorage; redirect ke dashboard sesuai role.
> Skenario 2 (Distribusi Stok oleh Keeper): Keeper -> Page DistribusiStok: pilih produk & qty, submit; Page -> hook useOutletProducts: mutation distribusiStok(); hook -> axios: POST /api/merchants/{id}/products dengan header Authorization Bearer; Controller/Service memvalidasi kepemilikan outlet dan stok gudang; Database: BEGIN, UPDATE warehouse_products, UPSERT merchant_products, COMMIT; balikan 201 Created; hook melakukan invalidateQueries dan menampilkan toast sukses.

### Kode Mermaid
```
sequenceDiagram
    autonumber
    actor U as Pengguna
    participant P as LoginPage
    participant A as authService
    participant X as axiosConfig
    participant API as API Laravel
    participant DB as Database

    rect rgb(234, 241, 250)
    note over U,DB: Skenario 1 - Login
    U->>P: isi email dan password, klik Login
    P->>A: login(email, password)
    A->>X: POST /api/login
    X->>API: POST /api/login (JSON)
    API->>DB: SELECT user, INSERT personal_access_token
    DB-->>API: user + plainTextToken
    API-->>X: 200 { token, user }
    A->>A: simpan token di localStorage
    A-->>U: redirect dashboard sesuai role
    end

    actor K as Keeper
    participant PG as DistribusiStok Page
    participant HK as useOutletProducts

    rect rgb(226, 239, 218)
    note over K,DB: Skenario 2 - Distribusi Stok ke Outlet
    K->>PG: pilih produk dan qty, submit
    PG->>HK: mutation distribusiStok()
    HK->>X: POST /api/merchants/{id}/products
    X->>API: request + header Authorization Bearer
    API->>DB: BEGIN; UPDATE warehouse_products; UPSERT merchant_products; COMMIT
    DB-->>API: OK
    API-->>HK: 201 Created
    HK->>HK: invalidateQueries + toast sukses
    HK-->>K: stok outlet diperbarui
    end
```

---

## Bonus: ERD

```
erDiagram
    CATEGORIES ||--o{ PRODUCTS : "category_id"
    WAREHOUSES ||--o{ WAREHOUSE_PRODUCTS : ""
    PRODUCTS ||--o{ WAREHOUSE_PRODUCTS : ""
    MERCHANTS ||--o{ MERCHANT_PRODUCTS : ""
    PRODUCTS ||--o{ MERCHANT_PRODUCTS : ""
    WAREHOUSES ||--o{ MERCHANT_PRODUCTS : ""
    USERS ||--o| MERCHANTS : "keeper_id"
    MERCHANTS ||--o{ TRANSACTIONS : ""
    TRANSACTIONS ||--o{ TRANSACTION_PRODUCTS : ""
    PRODUCTS ||--o{ TRANSACTION_PRODUCTS : ""
    MERCHANTS ||--o{ STOCK_OUTS : ""
    PRODUCTS ||--o{ STOCK_OUTS : ""
    USERS ||--o{ STOCK_OUTS : "user_id nullable"
```
