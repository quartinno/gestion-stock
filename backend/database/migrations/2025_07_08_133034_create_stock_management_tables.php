<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class CreateStockManagementTables extends Migration
{
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('business', function (Blueprint $table) {
            $table->char('business_id', 36)->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone', 50)->nullable();
            $table->text('address')->nullable();
            $table->dateTime('registration_date');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->timestamps();
            $table->index('email', 'idx_business_email');
            $table->index('status', 'idx_business_status');
        });

        Schema::create('plan', function (Blueprint $table) {
            $table->char('plan_id', 36)->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('duration')->comment('Duration in months');
            $table->integer('max_users');
            $table->integer('max_products');
            $table->json('features')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            $table->index('status', 'idx_plan_status');
        });

        Schema::create('subscription', function (Blueprint $table) {
            $table->char('subscription_id', 36)->primary();
            $table->char('business_id', 36);
            $table->char('plan_id', 36);
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->enum('status', ['active', 'expired', 'pending', 'cancelled'])->default('pending');
            $table->boolean('auto_renewal')->default(true);
            $table->timestamps();
            $table->foreign('business_id')->references('business_id')->on('business')->onDelete('cascade');
            $table->foreign('plan_id')->references('plan_id')->on('plan')->onDelete('restrict');
            $table->index('business_id', 'idx_subscription_business');
            $table->index('plan_id', 'idx_subscription_plan');
            $table->index('status', 'idx_subscription_status');
        });

        Schema::create('payment', function (Blueprint $table) {
            $table->char('payment_id', 36)->primary();
            $table->char('subscription_id', 36);
            $table->decimal('amount', 10, 2);
            $table->string('transaction_id')->nullable();
            $table->string('payment_method', 100);
            $table->dateTime('payment_date');
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->string('stripe_payment_intent_id')->nullable();
            $table->timestamps();
            $table->foreign('subscription_id')->references('subscription_id')->on('subscription')->onDelete('cascade');
            $table->index('subscription_id', 'idx_payment_subscription');
            $table->index('status', 'idx_payment_status');
            $table->index('payment_date', 'idx_payment_date');
        });

        Schema::create('users', function (Blueprint $table) {
            $table->char('user_id', 36)->primary();
            $table->char('business_id', 36);
            $table->string('username')->unique();
            $table->string('email');
            $table->string('password_hash');
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('phone', 50)->nullable();
            $table->enum('role', ['super_admin', 'business_admin', 'inventory_manager', 'cashier']);
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->dateTime('last_login')->nullable();
            $table->dateTime('email_verified_at')->nullable();
            $table->timestamps();
            $table->foreign('business_id')->references('business_id')->on('business')->onDelete('cascade');
            $table->index('business_id', 'idx_user_business');
            $table->index('username', 'idx_user_username');
            $table->index('email', 'idx_user_email');
            $table->index('role', 'idx_user_role');
            $table->index('status', 'idx_user_status');
        });

        Schema::create('user_session', function (Blueprint $table) {
            $table->char('session_id', 36)->primary();
            $table->char('user_id', 36);
            $table->string('token', 500);
            $table->dateTime('expires_at');
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('user_id')->references('user_id')->on('user')->onDelete('cascade');
            $table->index('user_id', 'idx_session_user');
            $table->index('token', 'idx_session_token');
            $table->index('expires_at', 'idx_session_expires');
        });

        Schema::create('category', function (Blueprint $table) {
            $table->char('category_id', 36)->primary();
            $table->char('business_id', 36);
            $table->string('name');
            $table->text('description')->nullable();
            $table->char('parent_id', 36)->nullable();
            $table->timestamps();
            $table->foreign('business_id')->references('business_id')->on('business')->onDelete('cascade');
            $table->foreign('parent_id')->references('category_id')->on('category')->onDelete('set null');
            $table->index('business_id', 'idx_category_business');
            $table->index('parent_id', 'idx_category_parent');
            $table->index('name', 'idx_category_name');
        });

        Schema::create('supplier', function (Blueprint $table) {
            $table->char('supplier_id', 36)->primary();
            $table->char('business_id', 36);
            $table->string('name');
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 50)->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
            $table->foreign('business_id')->references('business_id')->on('business')->onDelete('cascade');
            $table->index('business_id', 'idx_supplier_business');
            $table->index('name', 'idx_supplier_name');
        });

        Schema::create('product', function (Blueprint $table) {
            $table->char('product_id', 36)->primary();
            $table->char('business_id', 36);
            $table->char('category_id', 36);
            $table->char('supplier_id', 36);
            $table->string('name');
            $table->string('barcode');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('cost_price', 10, 2);
            $table->text('description')->nullable();
            $table->date('expiration_date')->nullable();
            $table->integer('quantity_in_stock')->default(0);
            $table->integer('minimum_stock_threshold')->default(0);
            $table->decimal('tax_rate', 5, 2)->default(0.00);
            $table->enum('status', ['active', 'inactive', 'discontinued'])->default('active');
            $table->timestamps();
            $table->foreign('business_id')->references('business_id')->on('business')->onDelete('cascade');
            $table->foreign('category_id')->references('category_id')->on('category')->onDelete('restrict');
            $table->foreign('supplier_id')->references('supplier_id')->on('supplier')->onDelete('restrict');
            $table->unique(['business_id', 'barcode'], 'unique_barcode_per_business');
            $table->index('business_id', 'idx_product_business');
            $table->index('category_id', 'idx_product_category');
            $table->index('supplier_id', 'idx_product_supplier');
            $table->index('barcode', 'idx_product_barcode');
            $table->index('status', 'idx_product_status');
        });

        Schema::create('stock_movement', function (Blueprint $table) {
            $table->char('movement_id', 36)->primary();
            $table->char('product_id', 36);
            $table->char('user_id', 36);
            $table->enum('movement_type', ['stock_in', 'stock_out', 'adjustment', 'damaged', 'expired']);
            $table->integer('quantity');
            $table->char('reference_id', 36)->nullable()->comment('References sale_id or invoice_id');
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('product_id')->references('product_id')->on('product')->onDelete('cascade');
            $table->foreign('user_id')->references('user_id')->on('user')->onDelete('restrict');
            $table->index('product_id', 'idx_stock_movement_product');
            $table->index('user_id', 'idx_stock_movement_user');
            $table->index('movement_type', 'idx_stock_movement_type');
            $table->index('created_at', 'idx_stock_movement_date');
        });

        Schema::create('client', function (Blueprint $table) {
            $table->char('client_id', 36)->primary();
            $table->char('business_id', 36);
            $table->string('name');
            $table->string('phone', 50)->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->decimal('credit_limit', 10, 2)->default(0.00);
            $table->decimal('credit_balance', 10, 2)->default(0.00);
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->timestamps();
            $table->foreign('business_id')->references('business_id')->on('business')->onDelete('cascade');
            $table->index('business_id', 'idx_client_business');
            $table->index('name', 'idx_client_name');
            $table->index('phone', 'idx_client_phone');
            $table->index('status', 'idx_client_status');
        });

        Schema::create('credit_transaction', function (Blueprint $table) {
            $table->char('transaction_id', 36)->primary();
            $table->char('client_id', 36);
            $table->enum('transaction_type', ['credit_sale', 'payment', 'adjustment']);
            $table->decimal('amount', 10, 2);
            $table->char('reference_id', 36)->nullable()->comment('References sale_id or invoice_id');
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('client_id')->references('client_id')->on('client')->onDelete('cascade');
            $table->index('client_id', 'idx_credit_transaction_client');
            $table->index('transaction_type', 'idx_credit_transaction_type');
            $table->index('created_at', 'idx_credit_transaction_date');
        });

        Schema::create('sale', function (Blueprint $table) {
            $table->char('sale_id', 36)->primary();
            $table->char('business_id', 36);
            $table->char('client_id', 36)->nullable();
            $table->char('user_id', 36);
            $table->dateTime('sale_date');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax_amount', 10, 2)->default(0.00);
            $table->decimal('discount_amount', 10, 2)->default(0.00);
            $table->decimal('total_amount', 10, 2);
            $table->enum('payment_method', ['cash', 'credit', 'card', 'mobile_money']);
            $table->enum('status', ['completed', 'cancelled', 'refunded'])->default('completed');
            $table->timestamps();
            $table->foreign('business_id')->references('business_id')->on('business')->onDelete('cascade');
            $table->foreign('client_id')->references('client_id')->on('client')->onDelete('set null');
            $table->foreign('user_id')->references('user_id')->on('user')->onDelete('restrict');
            $table->index('business_id', 'idx_sale_business');
            $table->index('client_id', 'idx_sale_client');
            $table->index('user_id', 'idx_sale_user');
            $table->index('sale_date', 'idx_sale_date');
            $table->index('status', 'idx_sale_status');
        });

        Schema::create('sale_item', function (Blueprint $table) {
            $table->char('sale_item_id', 36)->primary();
            $table->char('sale_id', 36);
            $table->char('product_id', 36);
            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_price', 10, 2);
            $table->decimal('discount_amount', 10, 2)->default(0.00);
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('sale_id')->references('sale_id')->on('sale')->onDelete('cascade');
            $table->foreign('product_id')->references('product_id')->on('product')->onDelete('restrict');
            $table->index('sale_id', 'idx_sale_item_sale');
            $table->index('product_id', 'idx_sale_item_product');
        });

        Schema::create('invoice', function (Blueprint $table) {
            $table->char('invoice_id', 36)->primary();
            $table->char('business_id', 36);
            $table->char('client_id', 36);
            $table->char('user_id', 36);
            $table->string('invoice_number', 100);
            $table->dateTime('invoice_date');
            $table->dateTime('due_date');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax_amount', 10, 2)->default(0.00);
            $table->decimal('discount_amount', 10, 2)->default(0.00);
            $table->decimal('total_amount', 10, 2);
            $table->enum('payment_status', ['pending', 'partial', 'paid', 'overdue'])->default('pending');
            $table->enum('status', ['draft', 'sent', 'paid', 'cancelled'])->default('draft');
            $table->timestamps();
            $table->foreign('business_id')->references('business_id')->on('business')->onDelete('cascade');
            $table->foreign('client_id')->references('client_id')->on('client')->onDelete('restrict');
            $table->foreign('user_id')->references('user_id')->on('user')->onDelete('restrict');
            $table->unique(['business_id', 'invoice_number'], 'unique_invoice_number_per_business');
            $table->index('business_id', 'idx_invoice_business');
            $table->index('client_id', 'idx_invoice_client');
            $table->index('user_id', 'idx_invoice_user');
            $table->index('invoice_date', 'idx_invoice_date');
            $table->index('due_date', 'idx_invoice_due_date');
            $table->index('payment_status', 'idx_invoice_payment_status');
            $table->index('status', 'idx_invoice_status');
        });

        Schema::create('invoice_item', function (Blueprint $table) {
            $table->char('invoice_item_id', 36)->primary();
            $table->char('invoice_id', 36);
            $table->char('product_id', 36);
            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_price', 10, 2);
            $table->decimal('discount_amount', 10, 2)->default(0.00);
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('invoice_id')->references('invoice_id')->on('invoice')->onDelete('cascade');
            $table->foreign('product_id')->references('product_id')->on('product')->onDelete('restrict');
            $table->index('invoice_id', 'idx_invoice_item_invoice');
            $table->index('product_id', 'idx_invoice_item_product');
        });

        Schema::create('invoice_payment', function (Blueprint $table) {
            $table->char('payment_id', 36)->primary();
            $table->char('invoice_id', 36);
            $table->decimal('amount', 10, 2);
            $table->enum('payment_method', ['cash', 'credit', 'card', 'mobile_money']);
            $table->dateTime('payment_date');
            $table->string('reference')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('invoice_id')->references('invoice_id')->on('invoice')->onDelete('cascade');
            $table->index('invoice_id', 'idx_invoice_payment_invoice');
            $table->index('payment_date', 'idx_invoice_payment_date');
        });

        Schema::create('notification', function (Blueprint $table) {
            $table->char('notification_id', 36)->primary();
            $table->char('business_id', 36);
            $table->char('user_id', 36)->nullable();
            $table->enum('type', ['low_stock', 'expiration', 'overdue_payment', 'subscription_expiry']);
            $table->string('title');
            $table->text('message');
            $table->char('reference_id', 36)->nullable()->comment('References related entity');
            $table->boolean('is_read')->default(false);
            $table->timestamp('created_at')->useCurrent();
            $table->dateTime('read_at')->nullable();
            $table->foreign('business_id')->references('business_id')->on('business')->onDelete('cascade');
            $table->foreign('user_id')->references('user_id')->on('user')->onDelete('cascade');
            $table->index('business_id', 'idx_notification_business');
            $table->index('user_id', 'idx_notification_user');
            $table->index('type', 'idx_notification_type');
            $table->index('is_read', 'idx_notification_read');
            $table->index('created_at', 'idx_notification_created');
        });

        Schema::create('alert_rule', function (Blueprint $table) {
            $table->char('rule_id', 36)->primary();
            $table->char('business_id', 36);
            $table->enum('type', ['low_stock', 'expiration', 'overdue_payment']);
            $table->integer('threshold_value');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->foreign('business_id')->references('business_id')->on('business')->onDelete('cascade');
            $table->index('business_id', 'idx_alert_rule_business');
            $table->index('type', 'idx_alert_rule_type');
            $table->index('is_active', 'idx_alert_rule_active');
        });

        Schema::enableForeignKeyConstraints();

        DB::table('plan')->insert([
            [
                'plan_id' => Str::uuid(),
                'name' => 'Basic Plan',
                'description' => 'Basic features for small businesses',
                'price' => 29.99,
                'duration' => 1,
                'max_users' => 5,
                'max_products' => 100,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'plan_id' => Str::uuid(),
                'name' => 'Pro Plan',
                'description' => 'Advanced features for growing businesses',
                'price' => 59.99,
                'duration' => 1,
                'max_users' => 15,
                'max_products' => 500,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'plan_id' => Str::uuid(),
                'name' => 'Enterprise Plan',
                'description' => 'Full features for large businesses',
                'price' => 99.99,
                'duration' => 1,
                'max_users' => 50,
                'max_products' => 1000,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down()
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('alert_rule');
        Schema::dropIfExists('notification');
        Schema::dropIfExists('invoice_payment');
        Schema::dropIfExists('invoice_item');
        Schema::dropIfExists('invoice');
        Schema::dropIfExists('sale_item');
        Schema::dropIfExists('sale');
        Schema::dropIfExists('credit_transaction');
        Schema::dropIfExists('client');
        Schema::dropIfExists('stock_movement');
        Schema::dropIfExists('product');
        Schema::dropIfExists('supplier');
        Schema::dropIfExists('category');
        Schema::dropIfExists('user_session');
        Schema::dropIfExists('user');
        Schema::dropIfExists('payment');
        Schema::dropIfExists('subscription');
        Schema::dropIfExists('plan');
        Schema::dropIfExists('business');

        Schema::enableForeignKeyConstraints();
    }
}