<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->enum('tax_type', ['percentage', 'fixed'])->nullable()->after('discount_amount');
            $table->decimal('tax_rate', 10, 2)->default(0)->after('tax_type');
            $table->decimal('tax_amount', 10, 2)->default(0)->after('tax_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn('tax_type');
            $table->dropColumn('tax_rate');
            $table->dropColumn('tax_amount');
        });
    }
};
