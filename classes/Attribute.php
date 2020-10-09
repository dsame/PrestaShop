<?php
echo "Hello"
	/*
class AttributeCore extends ObjectModel
{
    public $id_attribute_group;
    public $name;
    public $color;
    public $position;
    public $default;

    public static $definition = [
        'table' => 'attribute',
        'primary' => 'id_attribute',
        'multilang' => true,
        'fields' => [
            'id_attribute_group' => ['type' => self::TYPE_INT, 'validate' => 'isUnsignedId', 'required' => true],
            'color' => ['type' => self::TYPE_STRING, 'validate' => 'isColor'],
            'position' => ['type' => self::TYPE_INT, 'validate' => 'isInt'],

            'name' => ['type' => self::TYPE_STRING, 'lang' => true, 'validate' => 'isGenericName', 'required' => true, 'size' => 128],
        ],
    ];

    protected $image_dir = _PS_COL_IMG_DIR_;

    protected $webserviceParameters = [
        'objectsNodeName' => 'product_option_values',
        'objectNodeName' => 'product_option_value',
        'fields' => [
            'id_attribute_group' => ['xlink_resource' => 'product_options'],
        ],
    ];

    public function __construct($id = null, $idLang = null, $idShop = null)
    {
        parent::__construct($id, $idLang, $idShop);
        $this->image_dir = _PS_COL_IMG_DIR_;
    }

    public function delete()
    {
        if (!$this->hasMultishopEntries() || Shop::getContext() == Shop::CONTEXT_ALL) {
            $result = Db::getInstance()->executeS('SELECT id_product_attribute FROM ' . _DB_PREFIX_ . 'product_attribute_combination WHERE id_attribute = ' . (int) $this->id);
            $products = [];

            foreach ($result as $row) {
                $combination = new Combination($row['id_product_attribute']);
                $newRequest = Db::getInstance()->executeS('SELECT id_product, default_on FROM ' . _DB_PREFIX_ . 'product_attribute WHERE id_product_attribute = ' . (int) $row['id_product_attribute']);
                foreach ($newRequest as $value) {
                    if ($value['default_on'] == 1) {
                        $products[] = $value['id_product'];
                    }
                }
                $combination->delete();
            }

            foreach ($products as $product) {
                $result = Db::getInstance()->executeS('SELECT id_product_attribute FROM ' . _DB_PREFIX_ . 'product_attribute WHERE id_product = ' . (int) $product . ' LIMIT 1');
                foreach ($result as $row) {
                    if (Validate::isLoadedObject($product = new Product((int) $product))) {
                        $product->deleteDefaultAttributes();
                        $product->setDefaultAttribute($row['id_product_attribute']);
                    }
                }
            }

            // Delete associated restrictions on cart rules
            CartRule::cleanProductRuleIntegrity('attributes', $this->id);

            $this->cleanPositions((int) $this->id_attribute_group);
        }
        $return = parent::delete();
        if ($return) {
            Hook::exec('actionAttributeDelete', ['id_attribute' => $this->id]);
        }

        return $return;
    }

    public function update($nullValues = false)
    {
        $return = parent::update($nullValues);

        if ($return) {
            Hook::exec('actionAttributeSave', ['id_attribute' => $this->id]);
        }

        return $return;
    }

    public function add($autoDate = true, $nullValues = false)
    {
        if ($this->position <= 0) {
            $this->position = Attribute::getHigherPosition($this->id_attribute_group) + 1;
        }

        $return = parent::add($autoDate, $nullValues);

        if ($return) {
            Hook::exec('actionAttributeSave', ['id_attribute' => $this->id]);
        }

        return $return;
    }

    public static function getAttributes($idLang, $notNull = false)
    {
        if (!Combination::isFeatureActive()) {
            return [];
        }

        return Db::getInstance()->executeS('
			SELECT DISTINCT ag.*, agl.*, a.`id_attribute`, al.`name`, agl.`name` AS `attribute_group`
			FROM `' . _DB_PREFIX_ . 'attribute_group` ag
			LEFT JOIN `' . _DB_PREFIX_ . 'attribute_group_lang` agl
				ON (ag.`id_attribute_group` = agl.`id_attribute_group` AND agl.`id_lang` = ' . (int) $idLang . ')
			LEFT JOIN `' . _DB_PREFIX_ . 'attribute` a
				ON a.`id_attribute_group` = ag.`id_attribute_group`
			LEFT JOIN `' . _DB_PREFIX_ . 'attribute_lang` al
				ON (a.`id_attribute` = al.`id_attribute` AND al.`id_lang` = ' . (int) $idLang . ')
			' . Shop::addSqlAssociation('attribute_group', 'ag') . '
			' . Shop::addSqlAssociation('attribute', 'a') . '
			' . ($notNull ? 'WHERE a.`id_attribute` IS NOT NULL AND al.`name` IS NOT NULL AND agl.`id_attribute_group` IS NOT NULL' : '') . '
			ORDER BY agl.`name` ASC, a.`position` ASC
		');
    }

    public static function isAttribute($idAttributeGroup, $name, $idLang)
    {
        if (!Combination::isFeatureActive()) {
            return [];
        }

        $result = Db::getInstance()->getValue('
			SELECT COUNT(*)
			FROM `' . _DB_PREFIX_ . 'attribute_group` ag
			LEFT JOIN `' . _DB_PREFIX_ . 'attribute_group_lang` agl
				ON (ag.`id_attribute_group` = agl.`id_attribute_group` AND agl.`id_lang` = ' . (int) $idLang . ')
			LEFT JOIN `' . _DB_PREFIX_ . 'attribute` a
				ON a.`id_attribute_group` = ag.`id_attribute_group`
			LEFT JOIN `' . _DB_PREFIX_ . 'attribute_lang` al
				ON (a.`id_attribute` = al.`id_attribute` AND al.`id_lang` = ' . (int) $idLang . ')
			' . Shop::addSqlAssociation('attribute_group', 'ag') . '
			' . Shop::addSqlAssociation('attribute', 'a') . '
			WHERE al.`name` = \'' . pSQL($name) . '\' AND ag.`id_attribute_group` = ' . (int) $idAttributeGroup . '
			ORDER BY agl.`name` ASC, a.`position` ASC
		');

        return (int) $result > 0;
    }

    public static function checkAttributeQty($idProductAttribute, $qty, Shop $shop = null)
    {
        if (!$shop) {
            $shop = Context::getContext()->shop;
        }

        $result = StockAvailable::getQuantityAvailableByProduct(null, (int) $idProductAttribute, $shop->id);

        return $result && $qty <= $result;
    }

    public function isColorAttribute()
    {
        if (!Db::getInstance()->getRow('
			SELECT `group_type`
			FROM `' . _DB_PREFIX_ . 'attribute_group`
			WHERE `id_attribute_group` = (
				SELECT `id_attribute_group`
				FROM `' . _DB_PREFIX_ . 'attribute`
				WHERE `id_attribute` = ' . (int) $this->id . ')
			AND group_type = \'color\'')) {
            return false;
        }

        return Db::getInstance()->numRows();
    }

    public static function getAttributeMinimalQty($idProductAttribute)
    {
        $minimalQuantity = Db::getInstance()->getValue(
            '
			SELECT `minimal_quantity`
			FROM `' . _DB_PREFIX_ . 'product_attribute_shop` pas
			WHERE `id_shop` = ' . (int) Context::getContext()->shop->id . '
			AND `id_product_attribute` = ' . (int) $idProductAttribute
        );

        if ($minimalQuantity > 1) {
            return (int) $minimalQuantity;
        }

        return false;
    }

    public function updatePosition($direction, $position)
    {
        if (!$idAttributeGroup = (int) Tools::getValue('id_attribute_group')) {
            $idAttributeGroup = (int) $this->id_attribute_group;
        }

        $sql = '
			SELECT a.`id_attribute`, a.`position`, a.`id_attribute_group`
			FROM `' . _DB_PREFIX_ . 'attribute` a
			WHERE a.`id_attribute_group` = ' . (int) $idAttributeGroup . '
			ORDER BY a.`position` ASC';

        if (!$res = Db::getInstance()->executeS($sql)) {
            return false;
        }

        foreach ($res as $attribute) {
            if ((int) $attribute['id_attribute'] == (int) $this->id) {
                $movedAttribute = $attribute;
            }
        }

        if (!isset($movedAttribute) || !isset($position)) {
            return false;
        }

        // < and > statements rather than BETWEEN operator
        // since BETWEEN is treated differently according to databases

        $res1 = Db::getInstance()->execute(
            '
			UPDATE `' . _DB_PREFIX_ . 'attribute`
			SET `position`= `position` ' . ($direction ? '- 1' : '+ 1') . '
			WHERE `position`
			' . ($direction
                ? '> ' . (int) $movedAttribute['position'] . ' AND `position` <= ' . (int) $position
                : '< ' . (int) $movedAttribute['position'] . ' AND `position` >= ' . (int) $position) . '
			AND `id_attribute_group`=' . (int) $movedAttribute['id_attribute_group']
        );

        $res2 = Db::getInstance()->execute(
            '
			UPDATE `' . _DB_PREFIX_ . 'attribute`
			SET `position` = ' . (int) $position . '
			WHERE `id_attribute` = ' . (int) $movedAttribute['id_attribute'] . '
			AND `id_attribute_group`=' . (int) $movedAttribute['id_attribute_group']
        );

        return $res1 && $res2;
    }

    public function cleanPositions($idAttributeGroup, $useLastAttribute = true)
    {
        Db::getInstance()->execute('SET @i = -1', false);
        $sql = 'UPDATE `' . _DB_PREFIX_ . 'attribute` SET `position` = @i:=@i+1 WHERE';

        if ($useLastAttribute) {
            $sql .= ' `id_attribute` != ' . (int) $this->id . ' AND';
        }

        $sql .= ' `id_attribute_group` = ' . (int) $idAttributeGroup . ' ORDER BY `position` ASC';

        return Db::getInstance()->execute($sql);
    }

    public static function getHigherPosition($idAttributeGroup)
    {
        $sql = 'SELECT MAX(`position`)
				FROM `' . _DB_PREFIX_ . 'attribute`
				WHERE id_attribute_group = ' . (int) $idAttributeGroup;

        $position = Db::getInstance()->getValue($sql);

        return (is_numeric($position)) ? $position : -1;
    }
}
	 */
