import { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Chip, HelperText, Text, TextInput } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useModuleStore } from '@/stores/moduleStore';

const CATEGORIES = [
  { label: '全部', value: '' },
  { label: '修复', value: 'repair' },
  { label: '增强', value: 'enhancement' },
  { label: '风格', value: 'style' },
  { label: '创意', value: 'creative' },
];

const SORT_OPTIONS = [
  { label: '最新', value: 'recent' },
  { label: '热门', value: 'popular' },
  { label: '评分', value: 'rating' },
];

const VISIBILITY_OPTIONS = [
  { label: '全部', value: '' },
  { label: '管理员', value: 'admin' },
  { label: '编辑', value: 'editor' },
  { label: '普通用户', value: 'user' },
];

export function ModuleLibraryScreen() {
  const { modules, fetchModules, isLoading, error, filters } = useModuleStore();
  const [searchTags, setSearchTags] = useState('');

  const parsedTags = useMemo(() => {
    return searchTags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }, [searchTags]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const onApplyFilters = () => {
    fetchModules({
      tags: parsedTags,
    });
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="headlineMedium">模块库</Text>
        <Text variant="bodyMedium" style={styles.subheading}>
          浏览和筛选内部模块，根据权限查看可用功能。
        </Text>

        <View style={styles.filters}>
          <TextInput
            mode="outlined"
            label="标签（使用逗号分隔）"
            value={searchTags}
            onChangeText={setSearchTags}
            style={styles.filterInput}
          />
          <View style={styles.chipRow}>
            {CATEGORIES.map((category) => (
              <Chip
                key={category.value}
                selected={
                  filters.category === category.value || (!filters.category && !category.value)
                }
                onPress={() => fetchModules({ category: category.value || undefined })}
              >
                {category.label}
              </Chip>
            ))}
          </View>

          <View style={styles.chipRow}>
            {SORT_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                selected={
                  filters.sort === option.value || (!filters.sort && option.value === 'recent')
                }
                onPress={() => fetchModules({ sort: option.value as typeof filters.sort })}
              >
                {option.label}
              </Chip>
            ))}
          </View>

          <View style={styles.chipRow}>
            {VISIBILITY_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                selected={
                  (filters.visibility === option.value && option.value !== '') ||
                  (!filters.visibility && option.value === '')
                }
                onPress={() => fetchModules({ visibility: option.value || undefined })}
              >
                {option.label}
              </Chip>
            ))}
          </View>

          <Button mode="contained-tonal" onPress={onApplyFilters} style={styles.applyButton}>
            应用标签筛选
          </Button>
        </View>

        {error ? <HelperText type="error">加载失败：{error}</HelperText> : null}
      </View>

      {isLoading && modules.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={modules}
          keyExtractor={(item) => item.moduleId}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={() => fetchModules()} />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium">{item.name}</Text>
                <Chip mode="outlined" compact>
                  {item.category}
                </Chip>
              </View>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.cardMeta}>
                <Chip icon="office-building" compact>
                  {item.provider}
                </Chip>
                <Chip icon="star" compact>
                  {item.rating.toFixed(1)}
                </Chip>
                <Chip icon="cash" compact>
                  {item.costTier}
                </Chip>
                <Chip icon={item.enabled ? 'check-circle' : 'close-circle'} compact>
                  {item.enabled ? '启用' : '禁用'}
                </Chip>
              </View>
              <View style={styles.tagRow}>
                {item.tags.map((tag) => (
                  <Chip key={tag} mode="outlined" compact>
                    #{tag}
                  </Chip>
                ))}
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text variant="bodyLarge">暂无模块数据，请调整筛选条件。</Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 12,
    marginBottom: 16,
  },
  subheading: {
    color: '#6B7280',
  },
  filters: {
    gap: 12,
  },
  filterInput: {
    backgroundColor: 'transparent',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  applyButton: {
    alignSelf: 'flex-start',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    color: '#4B5563',
  },
  cardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
});
